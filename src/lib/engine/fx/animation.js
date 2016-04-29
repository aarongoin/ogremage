var Color = require('../../util/color');

// will treat any unknown vars as numbers
// will treat var 'f' & 'b' differently --> if string assume hexString, if object assume Color
var Animation = function(init) {
	var value, i;

	Animation.globalList.push(this);

	this.frames = init.keys; // { 0: {}, [...] 100: {} }
	this.keys = Object.keys(this.frames);

	this.vars = Object.keys(this.frames[0]);
	this.colors = [];
	this.cVars = [];
	
	i = this.vars.length;
	while (i--) {
		value = this.frames[0][this.vars[i]];
		if (typeof value === 'string') {
			this.colors.push(new Color(value));
			this.cVars.push( this.vars.splice(i, 1) );
		}
	}
	this.duration = init.duration; // in seconds

	this.percent = 0;
	this.state = this.frames[this.percent];

	this.repeat = init.repeat;
	this._repeat = this.repeat;

	this.isPlaying = init.isPlaying || false;
};
Animation.prototype.update = function(dt) {

	if (this.isPlaying) {

		this.percent += (100 * dt / this.duration) >> 0;
		if (this.percent > 100) {
			if (this.repeat-- > 0) this.percent = this.percent % 100;
			else return this.stop();
		}

		this.state = this.frames[this.percent] || this.tween();

		if (this.callback) this.callback(this);
	}

	return this.state;
};
Animation.prototype.play = function(percent, callback) {
	this.callback = callback;
	this.percent = percent || 0;
	this.isPlaying = true;
};
Animation.prototype.stop = function() {
	this.isPlaying = false;
	this.repeat = this._repeat;
};
Animation.prototype.tween = function() {
	var p,
		fA, fB,
		f = {},
		i;

	i = this.keys.length;
	while (i--) if (this.keys[i - 1] && (this.keys[i - 1] < this.percent) && (this.keys[i] > this.percent)) break;

	p = (this.percent - this.keys[i - 1]) / (this.keys[i] - this.keys[i - 1]);

	fA = this.frames[this.keys[i - 1]];
	fB = this.frames[this.keys[i]];

	i = this.vars.length;
	while (i--) f[this.vars[i]] = fA[this.vars[i]] + (p * (fB[this.vars[i]] - fA[this.vars[i]]));

	i = this.cVars.length;
	while (i--) {
		// tween color objects and return toHex()
	}

	return f;
};
Animation.globalList = [];
Animation.updateGlobal = function(dt) {
	var i = Animation.globalList.length;
	while(i--) Animation.globalList[i].update(dt);
};

module.exports = Animation;
var Color = require('../../util/color'),
	ShadowList = require('./shadows');

var Light = function(color, luminosity, tile) {

	this.id = Light.globalList.length;
	Light.globalList.push(this);

	this.tile = tile;

	this.color = new Color(color);
	this.shadows = new ShadowList();

	this.luminosity = luminosity;
	this.radius = Math.sqrt(luminosity / 0.01) >> 0;

	this.shineOn = this.shineOn.bind(this);

	this.isOn = false;
};
Light.prototype.brightness = function(distance) {
	this._alpha = (this.luminosity / distance);
	return (this._alpha > 1) ? 1 : this._alpha;
};
Light.prototype.shineFrom = function(tile) {
	this.tile = tile || this.tile;

	this.shadows.clear();

	this.tile.light += this.luminosity;
	tile.qLights.push( this.color.toRGBA(1.0) );

	this.tile.ripple(this.radius, this.shineOn);
};
Light.prototype.shineOn = function(tile, dx, dy) {

	this._distance = Math.sqrt(dx * dx + dy * dy);

	if (this.shadows.shadowCast(tile, dx, dy, this._distance)) this.drawOn(tile, this._distance);

};
Light.prototype.drawOn = function(tile, distance) {
	this._alpha = this.brightness(distance);
	tile.light += this._alpha;
	tile.qLights.push( [this.color, this._alpha] );
};

Light.globalList = [];
Light.update = function() {
	var i = this.globalList.length;
	while(i--) if (this.globalList[i] !== this && this.globalList[i].isOn) this.globalList[i].shineFrom();
};

module.exports = Light;
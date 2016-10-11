var Border = function(all) {
	this.n = null;
	this.ne = null;
	this.e = null;
	this.se = null;
	this.s = null;
	this.sw = null;
	this.w = null;
	this.nw = null;

	this.all = all;
	this.i = null;
};
Border.prototype.open = function(size) {
	var open = [];

	this.i = this.all.length;
	while (this.i--) {
		if (this.all[this.i].space >= size) open.push(this.all[this.i]);
	}

	return open;
};
Border.prototype.closed = function() {
	var closed = [];
	this.i = this.all.length;
	while (this.i--) if (this.all[this.i].isWall) closed.push(this.all[this.i]);

	return closed;
};

module.exports = Border;
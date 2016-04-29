var Color = function(hex) {
	if (typeof hex === 'string') this.beHex(hex);
	else this.become(hex);
};
Color.prototype.mixInto = function(color, percent) {
	percent = percent || 1.0;

	color.r = (color.r + this.r * percent) / 2 >> 0;
	color.g = (color.g + this.g * percent) / 2 >> 0;
	color.b = (color.b + this.b * percent) / 2 >> 0;

	color._changed = true;

};
Color.prototype.blend = function(dest, percent) {
	var q = 1 - percent;

	dest.r = (dest.r * q + this.r * percent) >> 0;
	dest.g = (dest.g * q + this.g * percent) >> 0;
	dest.b = (dest.b * q + this.b * percent) >> 0;

	dest._changed = true;
};
Color.prototype.toHex = function() {
	if (this._changed) {
		this._hex = '#' + ((this.r > 15) ? '' : '0') + this.r.toString(16) + ((this.g > 15) ? '' : '0') + this.g.toString(16) + ((this.b > 15) ? '' : '0') + this.b.toString(16);
		this._changed = false;
	}

	return this._hex;
};
Color.prototype.beHex = function(hex) {
	this._hex = hex;
	this._changed = false;
	this.r = parseInt( hex.substring(1, 3), 16);
	this.g = parseInt( hex.substring(3, 5), 16);
	this.b = parseInt( hex.substring(5, 7), 16);

	this._r = this.r;
	this._g = this.g;
	this._b = this.b;
};
Color.prototype.become = function(color) {
	this.r = color.r;
	this.g = color.g;
	this.b = color.b;

	this.bake();

	this._changed = true;
};
Color.prototype.bake = function() {
	this._r = this.r;
	this._g = this.g;
	this._b = this.b;
};

Color.prototype.reset = function() {
	this.r = this._r;
	this.g = this._g;
	this.b = this._b;

	this._changed = true;
};
Color._temp = { r: 0, g: 0, b: 0 };
Color.hex2RGB = function(hex) {
	Color._temp.r = parseInt( hex.substring(1, 3), 16);
	Color._temp.g = parseInt( hex.substring(3, 5), 16);
	Color._temp.b = parseInt( hex.substring(5, 7), 16);

	return Color._temp;
};

module.exports = Color;
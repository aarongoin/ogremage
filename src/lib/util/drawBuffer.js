var Color = require('../util/color');

var DrawBuffer = function(w, h) {

	if (w && h) this.setBuffer(new ArrayBuffer(w * h * 18), w, h);

	this.offset = 0;
	this._read = { t: { c: null, f: null, b: null }, x: null, y: null };
	this._f = new Color('#000000');
	this._b = new Color('#000000');
};

// Called every time the buffer passes from Game to Engine
DrawBuffer.prototype.setBuffer = function(buffer, w, h) {
	this.buffer = buffer;
	this.width = w;
	this.height = h;

	// Could functionally be Uint8 but would limit map size to maximum of 256 tiles in width and height
	this.reader = new Uint16Array(this.buffer);
	this.length = this.reader.length;
};

DrawBuffer.prototype.read = function() {

	if (this.offset === this.length) {
		this.offset = 0;
		return null;
	}

	this._read.t.c = this.reader[this.offset++];

	this._f.become({
		r: this.reader[this.offset++],
		g: this.reader[this.offset++],
		b: this.reader[this.offset++]
	});
	this._read.t.f = this._f.toHex();

	this._b.become({
		r: this.reader[this.offset++],
		g: this.reader[this.offset++],
		b: this.reader[this.offset++]
	});
	this._read.t.b = this._b.toHex();

	this._read.x = this.reader[this.offset++];
	this._read.y = this.reader[this.offset++];

	if (this._read.t.c === 114) {
		console.log();
	}

	return this._read;
};
DrawBuffer.prototype.write = function(x, y, t) {

	var offset = ((x * this.height) + y) * 9;

	if (t.c) this.reader[offset++] = t.c;
	else offset++;

	if (t.f) {
		this.reader[offset++] = t.f.r;
		this.reader[offset++] = t.f.g;
		this.reader[offset++] = t.f.b;
	} else offset += 3;

	if (t.b) {
		this.reader[offset++] = t.b.r;
		this.reader[offset++] = t.b.g;
		this.reader[offset++] = t.b.b;
	} else offset += 3;

	this.reader[offset++] = x;
	this.reader[offset++] = y;

	if (offset === this.length) {
		offset = 0;
	}
};

DrawBuffer.prototype.afk = function() {
	return (this.reader.buffer.byteLength === 0);
};

module.exports = DrawBuffer;
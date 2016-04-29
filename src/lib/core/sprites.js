'use strict';

var Sprites = function(sprites, colors){
	var image = new Image();

	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext("2d");
	this.width = sprites.width;
	this.height = sprites.height;
	this.count = sprites.count;

	this.canvas.height = this.height * (colors.length + 1);
	this.canvas.width = this.width * this.count;

	this.base = '#000';

	this.callback = sprites.onload;

	image.addEventListener("load", function() {
		var i = -1,
			l = colors.length,
			h = this.height,
			w = this.canvas.width;

		this.ctx.globalCompositeOperation = 'source-over';
		while (i++ <= l) {
			
			// draw clipping mask
			this.ctx.drawImage(image, 0, 0, w, h, 0, i * h, w, h);
		}

		this.ctx.globalCompositeOperation = 'source-atop';
		i = -1;
		while (i++ <= l) {
			// paint color into mask
			this.ctx.fillStyle = colors[i] || this.base;
			this.ctx.fillRect(0, i * h, w, h);
		}
        this.callback(this.canvas, this.ctx);
    }.bind(this), false);
    image.src = './sprites.png';
};

module.exports = Sprites;
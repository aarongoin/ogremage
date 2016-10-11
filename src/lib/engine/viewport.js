var Color = require('../util/color');

var Viewport = {
	draw: { c: null, f: null, b: null }
};

Viewport.useMap = function(MAP) {
	Viewport.MAP = MAP;
	Viewport.fov = MAP.fov;
	Viewport.drawFunc = (Viewport.fov === 'fog') ? 'drawFog' : (Viewport.fov === 'pc') ? 'drawPC' : 'drawFull';
};

Viewport.checkDims = function(w, h) {
	if ((Viewport.width !== w) && (Viewport.height !== h)) {
		Viewport.width = w;
		Viewport.height = h;

		Viewport.update(Viewport.PC);
	}
};

Viewport.update = function(pc) {
	
	Viewport.PC = pc;

	Viewport.left = pc.tile.x - (Viewport.width / 2) >> 0;
	Viewport.top = pc.tile.y - (Viewport.height / 2) >> 0;
	Viewport.right = Viewport.left + Viewport.width;
	Viewport.bottom = Viewport.top + Viewport.height;
};

Draw = function(buffer) {
	var mx = Viewport.left - 1,
		my,
		vx = -1,
		vy;

	while (++mx < Viewport.right) {
		vx++;
		my = Viewport.top - 1;
		vy = -1;
		while (++my < Viewport.bottom) {
			vy++;
			if ((mx > -1 && mx < Viewport.MAP.width) && (my > -1 && my < Viewport.MAP.height)) {
				Viewport.MAP.data[mx][my][Viewport.drawFunc]((Viewport.PC.pcCanSeeId || 0), Viewport.draw);
			} else {
				Viewport.draw.c = Viewport.nullSpace.c;
				Viewport.draw.f = Viewport.nullSpace.fb;
				Viewport.draw.b = Viewport.nullSpace.fb;
			}
			buffer.write(vx, vy, Viewport.draw);
		}
	}
};

Viewport.getMapTile = function(x, y) {
	var c = Viewport.MAP.data[Viewport.left + x];
	return (c) ? c[Viewport.top + y] : null;
};

Viewport.inBounds = function(tile) {
	return (tile.x < Viewport.right) && (tile.y < Viewport.bottom) && (tile.x >= Viewport.left) && (tile.y >= Viewport.top);
};

Viewport.nullSpace = { c: 0, fb: new Color('#000000') };

module.exports = {

	useMap: Viewport.useMap,

	checkDims: Viewport.checkDims,

	update: Viewport.update,

	draw: Draw,

	getMapTile: Viewport.getMapTile,

	inBounds: Viewport.inBounds

};
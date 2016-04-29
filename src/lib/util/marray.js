var x,
	y;

/**
 * create mutli-dimensional array
 * @param  {int} x    x dimensions
 * @param  {int} y    y dimensions
 * @param  {function} factory what to init every cell to
 * @return {Array}      returns newly initialized array
 */
var Marray = function(w, h, factory, old) {
	var a = [];
	x = -1;
	while (++x < w) {
		y = -1;
		a.push([]);
		while (++y < h) {
			a[x].push( (old && old[x] && old[x][y]) ? factor(old) : factory(x, y, a) );
		}
	}
	return a;
};

module.exports = Marray;
var key = 'draw';
module.exports = function(init) {
	return { 
		key: key,
		height: init.height,
		draw: init.draw
	};
};
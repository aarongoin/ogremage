var key = 'mover';
module.exports = function(init) {
	return {
		key: key,
		movement: init.movement,
		path: [] // points in space leading to current destination
	};
};
var key = 'body';
module.exports = function(init) {
	return {
		key: key,
		size: init.size,
		mass: init.mass,
		elasticity: init.elasticity
	};
};
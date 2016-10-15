var System = require('./system');

var possibleCollisions = [];

System.addSystem(function() {
	
});

function _velocityFinal(c, mA, vA, mB, vB) {
	return {
		vA: (mB * ((c * (vA + vB)) + vA + vB))/(mA + mB) + vA,
		vB: (mA * (vA - c * (vA + vB)) + mB * vB)/(mA + mB)
	};
}

function _kineticEnergy(m, v) {
	return (0.5 * m * (v.x * v.x + v.y * v.y));
}

// collisions will not utilize true kinematics, but a more simple heuristic w/ conservation of momentum
// conservation of momentum equation has 2 unknowns: the velocities of each body
// use center of mass frame to calculate resulting elastic collision
// use elasticity values for bodies to modify resulting velocities
function _collide(entity) {
	var cor = (entity.elasticity + this.elasticity) / 2, // coefficient of restitution
		vX = _velocityFinal(cor, this.mass, this.velocity.x, entity.mass, entity.velocity.x),
		vY = _velocityFinal(cor, this.mass, this.velocity.y, entity.mass, entity.velocity.y);

	this.velocity.x = vX.vA;
	this.velocity.y = vY.vA;

	entity.velocity.x = vX.vB;
	entity.velocity.y = vY.vB;
}
function _possibleCollision(list) {
	possibleCollisions = possibleCollisions.concat(list);
}

module.exports = {
	possibleCollision: _possibleCollision
};
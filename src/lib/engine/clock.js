var Clock = function(speed, secondsPerMinute) {

	this.resetTo(speed, secondsPerMinute);
};
Clock.prototype.tick = function(milliseconds) {
	if (this.speed) {
		this.dt = milliseconds / 1000;

		this.energy = this.dt * this.speed;

		return true;
	}

	return false;
};
Clock.prototype.resetTo = function(speed) {
	this.speed = speed;
	this.energy = 0;
};

module.exports = Clock;
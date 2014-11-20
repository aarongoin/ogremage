define(function() {
	var clock = {},
		energy = 0;

	/**
	 * returns delta time in a tick, depending on the energy level of the clock
	 * @return {Number} 1 or 0.0166 (represents the amount of time passing in an iteration)
	 */
	clock.tick = function() {
		if (energy >= 1) {
			energy--;
			return 1;
		} else {
			return 1/60; // 0.0166
		}
	};


	clock.wind = function(amount) { energy += amount; };

	clock.clean = function() { energy = 0; };

	return clock;
});
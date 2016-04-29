var _i;

var HUD = {
		meters: [],
		damage: [],
		speech: [],
		effects: []
	};

HUD.update = function() {
	_i = HUD.effects.length;
	while (_i--) ;

	_i = HUD.speech.length;
	while (_i--) HUD.speech[_i].draw();

	_i = HUD.damage.length;
	while (_i--) HUD.damage[_i].draw();

	_i = HUD.meters.length;
	while (_i--) HUD.meters[_i].update();
};

module.exports = HUD;
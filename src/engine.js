var Channel = require('./lib/util/channel'),
	Local = require('./lib/engine/local');

var ENGINE = {
		shouldRun: false,
		start: function(){},
		quit: function(){},
		update: function(){},
		loop: {
			last: null,
			start: Date.now(),
			dt: null
		}
	},
	GAME = new Channel(self);

	GAME.to('quit');
	GAME.to('save');

	GAME.from('init', function(copied, transfered) {


		ENGINE.LOCAL = new Local(ENGINE, copied, function(){
			ENGINE.shouldRun = true;
			ENGINE.start();
		});
	});

	GAME.from('input', function(gesture) {
		if (gesture.type === 't1Double') {
			ENGINE.LOCAL.t1Double(gesture);
		}
	});

	GAME.toFrom('draw', function(copied, transfered) {
		ENGINE.LOCAL.drawBuffer(transfered, copied.width, copied.height);
	});

ENGINE.start = function() {
	setTimeout(ENGINE.update, 0);
};

ENGINE.quit = function() {
	GAME.quit();
};

ENGINE.update = function() {
	ENGINE.loop.last = ENGINE.loop.start;
	ENGINE.loop.start = Date.now();
	ENGINE.loop.dt = ENGINE.loop.start - ENGINE.loop.last;

	ENGINE.LOCAL.update(ENGINE.loop.dt);

	if (ENGINE.shouldRun) setTimeout(ENGINE.update, (40 - (Date.now() - ENGINE.loop.start)));
	else ENGINE.quit();
};

ENGINE.draw = function(drawSpace) {
	GAME.draw({ transfer: drawSpace });
};
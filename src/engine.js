var Channel = require('./lib/util/channel'),
	Local = require('./lib/engine/local');

var ENGINE = {
		shouldRun: false,
		start: function(){},
		quit: function(){},
		update: function(){},
		loop: {
			last: null, // last datetime in milliseconds that loop ran
			start: Date.now(), // datetime in milliseconds that loop runs
			dt: null // the change in datetime in milliseconds since last loop
		}
	},
	GAME = new Channel(self);

GAME.to('quit');
GAME.to('save');

GAME.from('init', function(copied, transfered) {

	// Create Local Scene using blueprint copied in
	ENGINE.LOCAL = new Local(copied, ENGINE.draw, function(){
		ENGINE.shouldRun = true;
		ENGINE.start();
	});
});

GAME.from('input', function(gesture) {
	if (gesture.type === 't1Double') {
		// Pass double-tap to Local Scene
		ENGINE.LOCAL.t1Double(gesture);
	}
});

GAME.toFrom('draw', function(copied, transfered) {
	// Pass draw buffer to Local Scene
	ENGINE.LOCAL.drawBuffer(transfered, copied.width, copied.height);
});

GAME.from('resize', function(copied, transfered) {
	ENGINE.LOCAL.onResize(copied.width, copied.height);
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

	// Local Scene updates according to passed time step
	ENGINE.LOCAL.update(ENGINE.loop.dt);

	if (ENGINE.shouldRun) setTimeout(ENGINE.update, (40 - (Date.now() - ENGINE.loop.start)));
	else ENGINE.quit();
};

ENGINE.draw = function(drawSpace) {
	// Pass draw buffer to GAME for rendering
	GAME.draw({ transfer: drawSpace });
};
var Console = require('./console'),
	Handler = require('./handler'),
	//Main = require('./main'),
	//Library = require('./library'),
	INIT = require('../../bp/world'),
	Channel = require('../util/channel');

var Game = function() {

	// Create a new Console to draw to
	this.CONSOLE = new Console(INIT.console, this.init.bind(this));

	//this.LIBRARY = new Library(INIT);

	this.buildEngine();
};

Game.prototype.buildEngine = function() {

	this.ENGINE = new Channel( new Worker('engine.js') );

	// Allow Game to initialize Engine and pass input to it
	this.ENGINE.to('init');
	this.ENGINE.to('input');
	this.ENGINE.to('resize');

	// Allow Engine to initialize a save or quit action
	this.ENGINE.from('save', this.onSave.bind(this));
	this.ENGINE.from('quit', this.onQuit.bind(this));

	// Draw channel runs both ways
	this.ENGINE.toFrom('draw', this.onDraw.bind(this));
};

// Called when the Console is ready
Game.prototype.init = function() {

	this.CONSOLE.didResize = (function(dims) {
		this.ENGINE.resize({copy: dims});
	}).bind(this);

	// Create Handler that allows mouse interactions on the Console
	this.HANDLER = new Handler(this.CONSOLE, true);

	// Allow a double tap (double-click with left mouse button)
	// Passes input to Engine
	this.HANDLER.on('t1Double', function(gesture) {
		this.ENGINE.input({ copy: gesture });
	}.bind(this));

	this.HANDLER.start();

	//this.MAIN = new Main(INIT.main);

	INIT.console = null;
	this.ENGINE.init({copy: INIT});
	this.ENGINE.draw({ copy: { width: this.CONSOLE.width, height: this.CONSOLE.height }, transfer: this.CONSOLE.createDrawSpace() });
};

Game.prototype.onSave = function(copied, transfered) {
	// TODO
};

Game.prototype.onQuit = function(copied, transfered) {
	// Terminates Channel to Engine
	ENGINE.terminate();
};

Game.prototype.onDraw = function(copied, transfered) {
	// Passes drawSpace back to Engine after the Console draws it
	this.ENGINE.draw({ copy: { width: this.CONSOLE.width, height: this.CONSOLE.height }, transfer: this.CONSOLE.drawSpace(transfered) });
};
module.exports = Game;
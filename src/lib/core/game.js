var Console = require('./console'),
	Handler = require('./handler'),
	//Main = require('./main'),
	//Library = require('./library'),
	INIT = require('../../bp/world'),
	Channel = require('../util/channel');

var Game = function() {

	this.CONSOLE = new Console(INIT.console, this.init.bind(this));

	//this.LIBRARY = new Library(INIT);

	this.buildEngine();
};

Game.prototype.buildEngine = function() {

	this.ENGINE = new Channel( new Worker('engine.js') );

	this.ENGINE.to('init');
	this.ENGINE.to('input');

	this.ENGINE.from('save', this.onSave.bind(this));
	this.ENGINE.from('quit', this.onQuit.bind(this));

	this.ENGINE.toFrom('draw', this.onDraw.bind(this));
};

Game.prototype.init = function() {

	this.HANDLER = new Handler(this.CONSOLE, true);

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

};

Game.prototype.onQuit = function(copied, transfered) {
	ENGINE.terminate();
};

Game.prototype.onDraw = function(copied, transfered) {
	this.ENGINE.draw({ copy: { width: this.CONSOLE.width, height: this.CONSOLE.height }, transfer: this.CONSOLE.drawSpace(transfered) });
};
module.exports = Game;
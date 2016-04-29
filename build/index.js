(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={console:{canvas:document.getElementById('canvas'),fullscreen:true,clearBeforeDraw:true,sprites:{count:256,width:20,height:20},colors:['#000000','#333333','#666666','#999999','#cccccc','#ffffff','#b21f35','#d82735','#ff7435','#ffa135','#ffcb35','#fff735','#00753a','#009e47','#16dd36','#0052a5','#0079e7','#06a9fc','#681e7e','#7d3cb5','#bd7af6']},player:{type:"Human",name:"Stephen Colbert",life:3000,states:{"active":{c:2,f:'#ffffff'},"dead":{c:2,f:'#333333'}},state:"active",light:{color:'#ffffff',luminosity:1},odor:1.5,speed:1,sight:16},start:{area:'entryway',x:25,y:24},races:{Skeleton:{type:'Skeleton',supertype:'Undead',avgIQ:0,growth:0,density:0.5,migration:0,relations:{Human:-100,Skeleton:100,Rat:50},makeup:{'Mr. Dooty':0.1,'Mr. Skeltal':0.9},subtypes:{'Mr. Skeltal':{Entity:{name:'Mr. Skeltal',life:[10,12],states:{"active":{c:83,f:'#cccccc'},"dead":{c:83,f:'#333333'}},odor:1,size:0.9},Mover:{speed:0.75},Sensor:{see:10,hear:0,smell:0},Mob:{power:[1,2]}},'Mr. Dooty':{Entity:{name:'Mr. Dooty',life:[20,25],states:{"active":{c:83,f:'#ccccff'},"dead":{c:83,f:'#333333'}},odor:1,},Mover:{speed:[0.75,1]},Sensor:{see:10,hear:0,smell:0},Mob:{power:[4,5]}}}},Rat:{type:'Rat',supertype:'Beast',avgIQ:15,growth:0.08,density:1,migration:0.08,relations:{Human:-100,Skeleton:50,Rat:100},makeup:{'Rattus':1},subtypes:{'Rattus':{Entity:{name:'Rat',life:[3,4],states:{"active":{c:114,f:'#663300'},"dead":{c:114,f:'#333333'}},odor:2,},Mover:{speed:0.5},Sensor:{see:3,hear:10,smell:10},Mob:{power:0.2}}}},Human:{type:'Human',supertype:'Humanoid',avgIQ:100,growth:0.08,density:0.25,migration:0.25,relations:{Human:100,Skeleton:-100,Rat:-75},makeup:{'Average':1},subtypes:{Average:{Entity:{name:'Joe',life:[10,12],states:{"active":{c:2,f:'#ddddaa'},"dead":{c:2,f:'#333333'}},odor:1,},Mover:{speed:1},Sensor:{see:14,hear:7,smell:3},Mob:{power:4}}}},},areas:{rightWing:{id:'rightWing',title:"Bill Murray's Mansion - Right Wing",width:50,height:50,size:2500,fov:"pc",clock:1,base:{wall:{c:219,f:'#333333',b:'#000000',r:0.3},floor:{c:32,f:'#000000',b:'#052211',r:1},exit:{c:239,f:'#ffffff',b:'#333333',r:1}},generator:null,prefabs:[{x:0,y:0,w:50,h:50,walls:'50 50 2lkCB1 4oMv 0 36 6On7y 0 6oo 0 6 dcly 0 co rfuus zcg8 pzy x2 1aFjiU QNoc 16c8 2gN3jy 1L148T 0 1Eic 2fGQk 8NAA 3pbBm 4xAdi ianwk 5kk 2lkly3 6BaR 0 6c dCKf6 0 cMM 0 c qoH6 0 oM SuYYo 1HAMo P96 0 M 1HAMo 0 1B6 1aFjiw 1 3iAo 0 36 6Ono0 jiIQo 6oo i76 6 dclO ZAXe co rfuuc 0 pzy 0 o QNoc 0 Ny 1KZXWM 0 1Eic 0 1y 3pbyM 0 3cc 0 2lkCB1 1048575'}],exits:[{to:"leftWing",eID:0,x:0,y:1},{to:'entryway',eID:1,x:0,y:5}],footholds:[{race:'Skeleton',population:15,knowledge:0},{race:'Rat',population:50,knowledge:100}]},leftWing:{id:'leftWing',title:"Bill Murray's Mansion - Left Wing",width:50,height:50,size:2500,fov:"fog",clock:1,base:{wall:{c:219,f:'#333333',b:'#000000',r:0.3},floor:{c:32,f:'#000000',b:'#052211',r:1},exit:{c:239,f:'#ffffff',b:'#333333',r:1}},generator:null,prefabs:[{x:0,y:0,w:50,h:50,walls:'50 50 2lkCB1 4oMv 0 36 6On7y 0 6oo 0 6 dcly 0 co rfuus zcg8 pzy x2 1aFjiU QNoc 16c8 2gN3jy 1L148T 0 1Eic 2fGQk 8NAA 3pbBm 4xAdi ianwk 5kk 2lkly3 6BaR 0 6c dCKf6 0 cMM 0 c qoH6 0 oM SuYYo 1HAMo P96 0 M 1HAMo 0 1B6 1aFjiw 1 3iAo 0 36 6Ono0 jiIQo 6oo i76 6 dclO ZAXe co rfuuc 0 pzy 0 o QNoc 0 Ny 1KZXWM 0 1Eic 0 1y 3pbyM 0 3cc 0 2lkCB1 1048575'}],exits:[{to:'rightWing',eID:0,x:0,y:0},{to:'entryway',eID:0,x:2,y:0}],footholds:[{race:'Skeleton',population:15,knowledge:0},{race:'Rat',population:50,knowledge:100}]},entryway:{id:'entryway',title:"Bill Murray's Mansion - Entryway",width:50,height:50,size:2500,fov:"fog",clock:1,base:{wall:{c:219,f:'#333333',b:'#000000',r:0.3},floor:{c:32,f:'#000000',b:'#999999',r:1},exit:{c:239,f:'#ffffff',b:'#333333',r:1}},generator:null,prefabs:[{x:0,y:0,w:50,h:50,walls:'50 50 2lkCB1 4oMv 0 36 6On7y 0 6oo 0 6 dcly 0 co rfuus zcg8 pzy x2 1aFjiU QNoc 16c8 2gN3jy 1L148T 0 1Eic 2fGQk 8NAA 3pbBm 4xAdi ianwk 5kk 2lkly3 6BaR 0 6c dCKf6 0 cMM 0 c qoH6 0 oM SuYYo 1HAMo P96 0 M 1HAMo 0 1B6 1aFjiw 1 3iAo 0 36 6Ono0 jiIQo 6oo i76 6 dclO ZAXe co rfuuc 0 pzy 0 o QNoc 0 Ny 1KZXWM 0 1Eic 0 1y 3pbyM 0 3cc 0 2lkCB1 1048575'}],exits:[{to:"leftWing",eID:1,x:0,y:1},{to:"rightWing",eID:1,x:49,y:49}],footholds:[{race:'Skeleton',population:50,knowledge:0},{race:'Rat',population:150,knowledge:100},{race:'Human',population:20,knowledge:0}]},}};
},{}],2:[function(require,module,exports){
var Game = require('./lib/core/game');
var GAME = new Game();
},{"./lib/core/game":4}],3:[function(require,module,exports){
"use strict";
var Sprites = require('./sprites'),
    Marray = require('../util/marray'),
    DrawBuffer = require('../util/drawBuffer');
/**
 * @class Console
 * @constructor
 * @param {Object} init init options
 *        @param {HTMLElement} [init.canvas]
 *        @param {Boolean} [init.fullscreen]
 *        @param {Object} [init.sprites] spritesheet options
 *               @param {String} init.sprites.src spritesheet img source path
 *               @param {Number} init.sprites.count number of sprites in sheet
 *               @param {Number} init.sprites.width width of each sprite in pixels
 *               @param {Number} init.sprites.height height of each sprite in pixels
 *        @param {Array} [init.colors] string of hex and/or rgb/rgba colors to prerender sprites to
 *        @param {Object} [init.base] base tile to draw
 * @example
 *     new Console({
 *         canvas: document.createElement('canvas'),
 *         fullscreen: true,
 *         sprites: {
 *             src: './img/sprites20.png',
 *             count: 256,
 *             width: 20,
 *             height: 20
 *         },
 *         colors: [
 *             '#000000', // 0
 *             '#333333', // 1
 *             '#666666', // 2
 *             '#999999', // 3
 *             '#cccccc', // 4
 *             '#ffffff', // 5
 *             '#b21f35', // 6
 *             '#d82735', // 7
 *             '#ff7435', // 8
 *             '#ffa135', // 9
 *             '#ffcb35', // 10
 *             '#fff735', // 11
 *             '#00753a', // 12
 *             '#009e47', // 13
 *             '#16dd36', // 14
 *             '#0052a5', // 15
 *             '#0079e7', // 16
 *             '#06a9fc', // 17
 *             '#681e7e', // 18
 *             '#7d3cb5', // 19
 *             '#bd7af6'  // 20
 *          ]
 *     });
 */
var Console = function(init, onReady) {
    init = init || {};
    init.sprites = init.sprites || {
        src: './sprites20.png',
        count: 256,
        width: 20,
        height: 20
    };
    init.colors = init.colors || [
        /* grayscale dark  */
        '#000000', // 0
        '#333333', // 1
        '#666666', // 2
        /* grayscale light */
        '#999999', // 3
        '#cccccc', // 4
        '#ffffff', // 5
        /* red/orange      */
        '#b21f35', // 6
        '#d82735', // 7
        '#ff7435', // 8
        /* orange/yellow   */
        '#ffa135', // 9
        '#ffcb35', // 10
        '#fff735', // 11
        /* green           */
        '#00753a', // 12
        '#009e47', // 13
        '#16dd36', // 14
        /* blue            */
        '#0052a5', // 15
        '#0079e7', // 16
        '#06a9fc', // 17
        /* purple          */
        '#681e7e', // 18
        '#7d3cb5', // 19
        '#bd7af6'  // 20
    ];
    this.isActive = false;
    this.nextRender = null;
    this.instant = null;

    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);
    this.createTiles = this.createTiles.bind(this);

    this.clearBeforeDraw = init.clearBeforeDraw || false;

    // callback
	this.ready = onReady;

    /**
     * DOM reference to canvas element
     * @property {HTMLElement} canvas
     */
	this.canvas = init.canvas || document.createElement('canvas');
	this.ctx = this.canvas.getContext("2d");

    // tile redraw queue
    this.queue = [];
    this.tiles = [];

    /**
     * default tile drawn to console to fill tiles
     * @property {Object} base
     * @default { c: 0, f: '#fff', b: '#000' }
     */
    this.base = init.base || { c: 0, f: '#ffffff', b: '#000000' };

    /**
     * make console fullscreen
     * @property {Boolean} isFullscreen
     * @default true
     */
    this.isFullscreen = init.fullscreen || false;
    this.resizing = false;

    /**
     * console width in tiles
     * @property {Number} width
     */
    this.width = null;
    /**
     * console height in tiles
     * @property {Number} height
     */
    this.height = null;
    this.getDims();
    window.addEventListener('resize', this.onResize.bind(this), false);
    this.onResize();
    /**
     * prerendered sprites colors, can be referred to by index for efficiency
     * @property {Array} [colors]
     * @default ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff', '#b21f35', '#d82735', '#ff7435', '#ffa135', '#ffcb35', '#fff735', '#00753a', '#009e47', '#16dd36', '#0052a5', '#0079e7', '#06a9fc', '#681e7e', '#7d3cb5', '#bd7af6' ]
     */
    this.colors = init.colors;
    this.colors.add = function(v, i, c) {
        c.palette[v] = i;
    };
    this.colors.palette = {};
    this.colors.forEach(this.colors.add);

    // sprite sheet creation
    init.sprites.onload = (function(canvas, ctx){
        this.sprites = canvas;
        this.custom = ctx;
    }).bind(this);
    this.sheet = new Sprites(init.sprites, this.colors);
    /**
     * sprite widths in pixels
     * @property {Number} tileWidth
     */
    this.tileWidth = init.sprites.width;
    /**
     * sprite heights in pixels
     * @property {Number} tileHeight
     */
    this.tileHeight = init.sprites.height;
};
/**
 * convenience method for window.requestAnimationFrame
 * @method rAF
 */
Console.prototype.rAF = window.requestAnimationFrame.bind(window);
/**
 * convenience method for window.cancelAnimationFrame
 * @method cAF
 */
Console.prototype.cAF = window.cancelAnimationFrame.bind(window);

/**
 * clear console to color provided (will change letterboxing color if console has any margins)
 * @method clear
 * @param  {string} rgba string hex of color to clear to
 */
Console.prototype.clear = function(rgba) {
	rgba = rgba || "#000";

    this.queue = [];

	this.ctx.fillStyle = rgba;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = 'source-over';
};

/**
 * replace a single tile at coords
 * @method draw
 * @param  {Number} x x-coord of tile
 * @param  {Number} y y-coord of tile
 * @param  {Object} t tile containing only non-coordinate data
 *     @param  {Number} t.c index of sprite to draw
 *     @param  {String} t.f color to paint sprite foreground
 *     @param  {String} t.b color to paint sprite background
 */
Console.prototype.draw = function(x, y, t) {
    this.instant = this.tiles[x][y];

    if ((this.instant.c === t.c) && (this.instant.f === t.f) && (this.instant.b === t.b)) return false;

	this.instant.c = (t.c !== undefined) ? t.c : this.instant.c;
    this.instant.f = (t.f !== undefined) ? t.f : this.instant.f;
    this.instant.b = (t.b !== undefined) ? t.b : this.instant.b;

    this.instant.forecustom = (this.colors.palette[this.instant.f] === undefined);

    // flag for redraw if necessary
    if (this.queue.indexOf(this.instant) === -1) this.queue.push(this.tiles[x][y]);
};

/**
 * force console to redraw every tile
 * @method forceRedraw
 */
Console.prototype.forceRedraw = function() {
    var x = this.width,
        y;
    while (x--) {
        y = this.height;
        while (y--) {
            this.draw(x, y, this.tiles[x][y]);
        }
    }
};

/**
 * redraw array of tiles
 * @method paint
 * @param  {Array} m tiles to redraw *see Console.draw() for tile params
 */
Console.prototype.paint = function(m) {
    var t;
    while ((t = m.pop())) { this.draw(t.x, t.y, t); }
};

/**
 * render the console continuously
 * @method start
 */
Console.prototype.start = function() {
    if (!this.isActive) {
        this.isActive = true;
        this.nextRender = this.rAF(this.render);
        if (this.ready) setTimeout(this.checkReady.bind(this), 0);
    }
};

/**
 * stop continuous console render loop
 * @method stop
 */
Console.prototype.stop = function() {
	this.cAF(this.nextRender);
    this.isActive = false;
};


///////////////////////////////////////////////////////////////////////////////////////
// INTERNAL USE ONLY //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// this.height
// this.tiles

Console.prototype.createDrawSpace = function() {
    this.drawBuffer = new DrawBuffer(this.width, this.height);

    return this.drawBuffer.buffer;
};

Console.prototype.drawSpace = function(buffer) {
    var t;
    this.drawBuffer.setBuffer(buffer, this.width, this.height);
    while (t = this.drawBuffer.read()) this.draw(t.x, t.y, t.t);
    return this.drawBuffer.buffer;
};

Console.prototype.createTiles = function() {
    var w = this.canvas.width,
        h = this.canvas.height,
        x, y, i, o, j, k, l, col,
        addX = true,
        addY = true;

    // is console width shrinking?
    if (this.tiles.length === this.width) addX = null;
    else if (this.tiles.length > this.width) {
        i = this.width;
        o = this.tiles.length;
        addX = false;
    // is console width growing?
    } else if (this.tiles.length < this.width) {
        i = this.tiles.length;
        o = this.width;
    }

    // is console height shrinking?
    if (this.tiles[0] && this.tiles[0].length === this.height) addX = null;
    else if (this.tiles[0] && this.tiles[0].length > this.height) {
        j = l = this.height;
        k = this.tiles[0].length;
        addY = false;
    // is console height growing?
    } else if (!this.tiles[0] || this.tiles[0].length < this.height) {
        j = l = (this.tiles[0]) ? this.tiles[0].length : 0;
        k = this.height;
    } else addY = null;

    if (addX === null && addY === null) return this.start();

    this.clear();

    i--;
    l--;
    x = this.marginX;
    while (++i < o) {
        if (addX) {
            this.tiles.push([]);
            col = this.tiles[i];
            j = l;
            y = this.marginY;
            while (++j < k) {
                if (addY) {
                    col.push({
                        c: this.base.c, // sprite number within sprite sheet
                        x: x, // x coord in pixels
                        y: y, // y coord in pixels
                        f: this.base.f, // foreground color
                        b: this.base.b, // background color
                        forecustom: (this.base.f.charAt) ? true : false,
                    });
                    y += this.tileHeight;
                } else col.pop();
            }
            x += this.tileWidth;
        } else this.tiles.pop();
    }
    this.start();
};

/**
 * [onResize description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
Console.prototype.onResize = function(event) {
    this.stop();
    this.rAF(this.resize);
};

Console.prototype.getDims = function() {
    this.dims = [
        (this.canvas.width / window.innerWidth),
        (this.canvas.width / window.innerHeight)
    ];
};

Console.prototype.resize = function() {

    if (this.isFullscreen) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    } else {
        this.canvas.width = this.dims[0] * window.innerWidth >> 0;
        this.canvas.height = this.dims[1] * window.innerHeight >> 0;
    }

    this.width = this.canvas.width / this.tileWidth >> 0;
    this.height = this.canvas.height / this.tileHeight >> 0;

    this.marginX = (this.canvas.width - this.width * this.tileWidth) / 2 >> 0;
    this.marginY = (this.canvas.height - this.height * this.tileHeight) / 2 >> 0;

    if (this.tiles.length !== this.width || this.tiles[0].length !== this.height) this.createTiles();
    else this.start();

    if (this.didResize) this.didResize(this.width, this.height);
};

Console.prototype.checkReady = function(){
    if (this.sprites) {
        if (this.ready) {
            this.ready();
            this.ready = undefined;
        }
    } else setTimeout(this.checkReady.bind(this), 0);
};

// DRAW RELATED /////////////////////////////////////////////////////////////////////////////

Console.prototype.render = function(time) {
    //if (this.clearBeforeDraw) this.clear();
    while ( this.blit( this.queue.pop() ) );
    this.rAF(this.render);
};

Console.prototype.blit = function(tile) {
    if (!tile) return false;

    // background color
    this.ctx.fillStyle = tile.b;
    this.ctx.fillRect(tile.x, tile.y, this.tileWidth, this.tileHeight);    

    if (tile.forecustom) { //custom fore
        // forground color (painted only within the clipping mask of sprite sheet canvas)
        this.custom.fillStyle = tile.f;
        this.custom.fillRect(tile.c * this.tileWidth, this.colors.length * this.tileHeight, this.tileWidth, this.tileHeight);

        this.ctx.drawImage(this.sprites, tile.c * this.tileWidth, this.colors.length * this.tileHeight, this.tileWidth, this.tileHeight, tile.x, tile.y, this.tileWidth, this.tileHeight);
    } else {
        this.ctx.drawImage(this.sprites, tile.c * this.tileWidth, this.colors.palette[tile.f] * this.tileHeight, this.tileWidth, this.tileHeight, tile.x, tile.y, this.tileWidth, this.tileHeight);
    }
    return true;
};

module.exports = Console;

// Adapted from https://gist.github.com/paulirish/1579671 which derived from 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame'] ||
                                       window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
        !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());
},{"../util/drawBuffer":9,"../util/marray":10,"./sprites":6}],4:[function(require,module,exports){
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
},{"../../bp/world":1,"../util/channel":7,"./console":3,"./handler":5}],5:[function(require,module,exports){
"use strict";
var Handler = function(con, mouse) {

	this.marginX = con.marginX;
	this.marginY = con.marginY;

	this.tileWidth = con.tileWidth;
	this.tileHeight = con.tileHeight;

	console.log("input: init " + ((mouse) ? "mouse" : "touch"));
	if (mouse) {
		con.canvas.addEventListener("mousedown", this.mouseDown.bind(this));
		con.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
		con.canvas.addEventListener("mouseup", this.mouseUp.bind(this));
	} else {
		con.canvas.addEventListener("touchstart", this.touchStart.bind(this));
		con.canvas.addEventListener("touchmove", this.touchMove.bind(this));
		con.canvas.addEventListener('touchend', this.touchEnd.bind(this));
	}

	this.gestures = {
		// single touch gesture callbacks
		t1Tap: this.logGesture,
		t1Hold: this.logGesture,
		t1Double: this.logGesture,
		t1Drag: this.logGesture,
		t1Swipe: this.logGesture,

		// double touch gesture callbacks
		t2Tap: this.logGesture,
		t2Hold: this.logGesture,
		t2Double: this.logGesture,
		t2Drag: this.logGesture,
		t2Swipe: this.logGesture,
		t2Pinch: this.logGesture,
		t2Rotate: this.logGesture,

		// triple touch gesture callbacks
		t3Tap: this.logGesture,
		t3Hold: this.logGesture,
		t3Double: this.logGesture,
		t3Drag: this.logGesture,
		t3Swipe: this.logGesture,
		t3Pinch: this.logGesture,
		t3Rotate: this.logGesture
	};

	this.current = [];
	this.feedback = {};
	this.lastTap = null;
	this.mgTimerID = null;

};
Handler.prototype.on = function(gesture, callback) {
	this.gestures[gesture] = callback;
};
Handler.prototype.start = function() {
	this.active = true;
};
Handler.prototype.stop = function(callback) {
	this.inactive = callback || this.inactive;
	this.active = false;
};
Handler.prototype.handle = function(gesture) {
	if (this.active) {
		gesture.type = 't' + gesture.length + gesture.recognized;
		this.gesture = gesture;
		if (this.gestures[gesture.type]) this.gestures[gesture.type](gesture);
		if (this.feedback[gesture.type]) this.feedback[gesture.type](gesture);
	} else if (this.inactive) this.inactive(gesture);
};
Handler.prototype.swapCallbacks = function(gestures) {
	var old = this.gestures;
	this.gestures = gestures;
	return old;
};

/**
 * gets all current touches that have changed with callback hook
 * @param  {object}   event    [description]
 * @param  {Function} callback parameters: changedTouch, current index
 */
Handler.prototype.changedCurrent = function(event, callback) {
	var i, t, j;
	i = event.changedTouches.length;
	while (i--) {
		t = event.changedTouches[i];
		j = this.current.length;
		while (j--) if (t.id === this.current[j].id) callback(t, j);
	}
};

/**
 * calculate x and y tile coords being touched
 * @param  {object} touch touch event to be modified
 * @return {object}       returns modified touch object
 */
Handler.prototype.touchTile = function(touch) {
	touch.tileX = ((touch.clientX - this.marginX) / this.tileWidth) >> 0;
	touch.tileY = ((touch.clientY - this.marginY) / this.tileHeight) >> 0;
	return touch;
};
/**
 * mostly just passing the beginning of a gesture along to the handler
 * @param  {array} added touches making up gesture
 * @param  {boolean} mouse if this is a mouse event
 */
Handler.prototype.gestureBegin = function(added, mouse) {
	var i, gesture = [];

	gesture.isMouse = mouse || false;
	gesture.recognized = (mouse) ? added.recognized : "unknown";

	i = added.length;
	while (i--) gesture.push( added[i] );

	gesture.state = "begin";
	this.handle(gesture);
};

/**
 * mostly just passing the movement of a gesture along to the handler
 * @param  {array} moved touches making up gesture movement
 * @param  {boolean} mouse if this is a mouse event
 */
Handler.prototype.gestureMove = function(moved, mouse) {
	var i, t, len = moved.length,
		gesture = [];

	gesture.isMouse = mouse || false;
	gesture.recognized = (mouse) ? moved.recognized : "unknown";

	gesture.tileX = 0;
	gesture.tileY = 0;
	gesture.distance = 0;
	gesture.speed = 0;
	gesture.dt = 0;

	i = moved.length;
	while (i--) {
		t = moved[i];
		t.dx = t.tileX - t.tileX0;
		t.dy = t.tileY - t.tileY0;
		t.dt = t.end - t.start;

		t.distance = Math.sqrt( (t.dx * t.dx) + (t.dy * t.dy) );
		t.speed = t.distance / t.dt;

		// summing touch values for calculating gesture averages
		gesture.tileX += t.tileX;
		gesture.tileY += t.tileY;
		gesture.distance += t.distance;
		gesture.dt += t.dt;

		gesture.push(t);
	}

	// dividing sums by length for gesture averages
	gesture.tileX /= len;
	gesture.tileY /= len;
	gesture.distance /= len;
	gesture.dt /= len;

	gesture.speed = (gesture.distance / gesture.dt) * 1000;

	if (!mouse || (mouse && moved.recognized === "Simple")) {
		gesture.recognized = (gesture.speed > 50) ? "Swipe" : "Drag";
	} else {
		gesture.recognized = moved.recognized;
	}

	gesture.state = "moving";
	this.handle(gesture);
};

/**
 * detecting final recognized type of an ending gesture and pass along to the handler
 * @param  {array} removed touches making up gesture
 * @param  {boolean} mouse if this is a mouse event
 */
Handler.prototype.gestureEnd = function(removed, mouse) {
	var i, g, t, len,
		gesture = [];

	gesture.isMouse = mouse || false;
	gesture.recognized = (mouse) ? removed.recognized : "unknown";

	gesture.tileX = 0;
	gesture.tileY = 0;
	gesture.distance = 0;
	gesture.speed = 0;
	gesture.dt = 0;

	i = len = removed.length;
	while (i--) {
		g = {};
		t = removed[i];

		g.dx = t.tileX - t.tileX0;
		g.dy = t.tileY - t.tileY0;
		g.dt = t.end - t.start;

		g.distance = Math.sqrt( (g.dx * g.dx) + (g.dy * g.dy) );
		g.speed = g.dis / g.dt;

		// summing touch values for calculating gesture averages
		gesture.tileX += t.tileX;
		gesture.tileY += t.tileY;
		gesture.distance += g.distance;
		gesture.dt += g.dt;

		gesture.push(g);
	}

	// dividing sums by length for gesture averages
	gesture.tileX /= len;
	gesture.tileY /= len;
	gesture.distance /= len;
	gesture.dt /= len;

	gesture.speed = (gesture.distance / gesture.dt) * 1000;

	// detect touch type
	// TODO - recognize pinch and rotate gestures along with directionality for non-mouse gestures
	if (!mouse || (mouse && gesture.recognized === "Simple")) {
		if (gesture.distance < 50) {
			if (gesture.dt > 1000) {
				gesture.recognized = "Hold";
			} else if ((this.lastTap) &&
						(Date.now() - this.lastTap.end < 300) &&
						(this.lastTap.count === gesture.length) &&
						(this.lastTap.tileX === gesture.tileX) &&
						(this.lastTap.tileY === gesture.tileY)) {
				gesture.recognized = "Double";

				// ensure we cannot fire a doubletap immediately after another doubletap
				this.lastTap = null;
			} else {
				gesture.recognized = "Tap";

				// save this tap for detecting doubletap
				this.lastTap = {
					end: Date.now(),
					count: gesture.length,
					tileX: gesture.tileX,
					tileY: gesture.tileY
				};

			}
		} else if (gesture.speed > 50) {
			gesture.recognized = "Swipe";
		} else {
			gesture.recognized = "Drag";
		}
	} else {
		gesture.recognized = removed.recognized;
	}

	gesture.state = "ended";
	this.handle(gesture);
};

/**
 * touchstart event callback --handles beginning touches
 * @param  {object} event dom event object
 */
Handler.prototype.touchStart = function(event) {
	var i, j, t, fresh;
	event.preventDefault();

	// ignore any touches beyond the first three
	if (this.current.length > 2) return;

	fresh = (this.current.length) ? false : true;

	// add new touches until we have three or there are no more to add
	i = 0;
	j = event.changedTouches.length;
	while (i < j) {
		t = event.changedTouches[i];
		t.start = Date.now();
		this.touchTile(t); // set touch x and y tile coords
		t.tileX0 = t.tileX;
		t.tileY0 = t.tileY;
		this.current.push(t);
		if (this.current.length === 3) break;
	}

	if (fresh) this.gestureBegin(this.current);
};

/**
 * touchmove event callback --handles moving touches
 * @param  {object} event dom event object
 */
Handler.prototype.touchMove = function(event) {
	var moved = [];
	event.preventDefault();

	// find changed current touches
	this.changedCurrent(event, (function(changed, index) {
		this.touchTile(changed); // set touch x and y tile coords
		moved.push(changed); // grab the moved touch
	}).bind(this));

	this.gestureMove(moved);
};

/**
 * touchend event callback --handles ending touches
 * @param  {object} event dom event object
 */
Handler.prototype.touchEnd = function(event) {
	var i, j, t, removed = [];
	event.preventDefault();

	// find changed current touches
	this.changedCurrent(event, (function(changed, index) {
		changed.end = Date.now(); // ending time of touch
		this.touchTile(changed); // set touch x and y tile coords
		removed.concat( this.current.splice(index + 1, 1) ); // delete the finished touch
	}).bind(this));

	// if no touches left, detect final touch type
	if (this.current.length === 0) this.gestureEnd(removed);
};

// detect buttons pressed
// button 1                     => 1-touch (tap/hold/drag/swipe)
// button 2                     => 2-touch (tap/hold/drag/swipe)
// button 3                     => 3-touch (tap/hold/drag/swipe)
// button 1 & button 2          => 3-touch (tap/hold/drag/swipe)
// ctrl & 2-touch               => 2-touch (pinch/spread)
// ctrl & 3-touch               => 3-touch (pinch/spread)
// shift & 2-touch              => 2-touch (rotate left/right)
// shift & 3-touch              => 3-touch (rotate left/right)

/**
 * mousedown event callback -- multi-touch polyfill
 * @param  {object} event dom event object
 */
Handler.prototype.mouseDown = function(event) {
	var i, l = this.current.length,
		touch, mod;
	event.preventDefault();

	// ignore mouse if we already have three touches or if button pressed was not among the first three
	if ((l > 2) || (event.which > 3)) return;

	// create a touch object for the mouse
	touch = {
		start: Date.now(),
		id: event.which,
		clientX: event.clientX,
		clientY: event.clientY
	};

	// set touch x and y tile coords
	this.touchTile(touch);
	touch.tileX0 = touch.tileX;
	touch.tileY0 = touch.tileY;

	// get only one modifier key
	// WARNING - given nature of touch spoofing: ctrl + button-1 followed by shift + button-2
	//           will result in a 3-touch rotation gesture because the shift will overwrite the ctrl
	// TODO - handle both at the same time for pinch-rotate gesture
	mod = (event.ctrlKey  && !event.shiftKey) ? "Pinch" : (event.shiftKey && !event.ctrlKey) ? "Rotate" : null;
	this.current.recognized = (mod && l > 1) ? mod : "Simple";
	// mouse has small advantage here to touch because based on the
	// presence of modifier keys, we can actually infer complex gestures

	// spoofing i touches where i is the button number
	i = touch.id;
	while (i--) this.current.push(touch);

	// set timeout if less than 3 touches or if there's already a timeout set for the gesture
	// because each button-press fires it's own event, this gives the user time to press all the desired buttons
	l = this.current.length;
	if ((l < 3) && (!this.mgTimerID)) {
		this.mgTimerID = setTimeout((function() {
			if (this.current.length === l) this.gestureBegin(this.current, true);
			this.mgTimerID = null;
		}).bind(this), 200); // 1/5th of a second
	} else {
		this.gestureBegin(this.current, true);
	}
};

/**
 * mousemove event callback -- multi-touch polyfill
 * @param  {object} event dom event object
 */
Handler.prototype.mouseMove = function(event) {
	var t, i = this.current.length;
	event.preventDefault();
	// ignore mouse movement if the user isn't clicking
	if (i) {
		// update each touches x and y tile coordinates
		while (i--) {
			t = this.current[i];
			t.clientX = event.clientX;
			t.clientY = event.clientY;
			this.touchTile(t);
		}
		this.gestureMove(this.current, true);
	}
};

/**
 * mouseup event callback -- multi-touch polyfill
 * @param  {object} event dom event object
 */
Handler.prototype.mouseUp = function(event) {
	var t, i = this.current.length,
		removed;
	event.preventDefault();
	// ignore mouseup if the user isn't clicking one of first 3 buttons
	if (i) {
		// update each touches x and y tile coordinates and get time touch ended
		while (i--) {
			t = this.current[i];
			t.end = Date.now();
			t.clientX = event.clientX;
			t.clientY = event.clientY;
			this.touchTile(t);
		}
		removed = this.current;
		this.current = [];
		this.gestureEnd(removed, true);
	}
};

Handler.logGesture = function(gesture) {
	console.log("gesture: " + gesture.recognized);
	console.log("touches: " + gesture.length);
};

module.exports = Handler;
},{}],6:[function(require,module,exports){
'use strict';

var Sprites = function(sprites, colors){
	var image = new Image();

	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext("2d");
	this.width = sprites.width;
	this.height = sprites.height;
	this.count = sprites.count;

	this.canvas.height = this.height * (colors.length + 1);
	this.canvas.width = this.width * this.count;

	this.base = '#000';

	this.callback = sprites.onload;

	image.addEventListener("load", function() {
		var i = -1,
			l = colors.length,
			h = this.height,
			w = this.canvas.width;

		this.ctx.globalCompositeOperation = 'source-over';
		while (i++ <= l) {
			
			// draw clipping mask
			this.ctx.drawImage(image, 0, 0, w, h, 0, i * h, w, h);
		}

		this.ctx.globalCompositeOperation = 'source-atop';
		i = -1;
		while (i++ <= l) {
			// paint color into mask
			this.ctx.fillStyle = colors[i] || this.base;
			this.ctx.fillRect(0, i * h, w, h);
		}
        this.callback(this.canvas, this.ctx);
    }.bind(this), false);
    image.src = './sprites.png';
};

module.exports = Sprites;
},{}],7:[function(require,module,exports){
var Channel = function(worker) {
	this._worker = worker;
	this._on = { terminate: this._terminate };
	this._i = null;

	this._onMessage = this._onMessage.bind(this);
	worker.addEventListener('message', this._onMessage);
};

Channel.prototype.terminate = function() {

	this._worker.removeEventListener('message', this._onMessage);

	this._worker.postMessage({ id: 'terminate' });
};

Channel.prototype.to = function(name) {

	this[name] = function(data) {
		if (!data) this._worker.postMessage({ id: name });
		else if (data.transfer) this._worker.postMessage({ copy: data.copy, id: name, transfer: data.transfer }, [data.transfer]);
		else this._worker.postMessage({ copy: data.copy, id: name });
	};

	return this[name];
};

Channel.prototype.from = function(name, callback){
	this._on[name] = callback;
};

Channel.prototype.toFrom = function(name, callback) {
	this.from(name, callback);
	return this.to(name);
};

Channel.prototype._onMessage = function(event) {

	if (event.data.id) {

		this._i = this._on[event.data.id];
		if (this._i) this._i(event.data.copy, event.data.transfer);

		this._i = null;
	}
};

Channel.prototype._terminate = function() {
	this._worker.removeEventListener('message', this._onMessage);
};

module.exports = Channel;
},{}],8:[function(require,module,exports){
var Color = function(hex) {
	if (typeof hex === 'string') this.beHex(hex);
	else this.become(hex);
};
Color.prototype.mixInto = function(color, percent) {
	percent = percent || 1.0;

	color.r = (color.r + this.r * percent) / 2 >> 0;
	color.g = (color.g + this.g * percent) / 2 >> 0;
	color.b = (color.b + this.b * percent) / 2 >> 0;

	color._changed = true;

};
Color.prototype.blend = function(dest, percent) {
	var q = 1 - percent;

	dest.r = (dest.r * q + this.r * percent) >> 0;
	dest.g = (dest.g * q + this.g * percent) >> 0;
	dest.b = (dest.b * q + this.b * percent) >> 0;

	dest._changed = true;
};
Color.prototype.toHex = function() {
	if (this._changed) {
		this._hex = '#' + ((this.r > 15) ? '' : '0') + this.r.toString(16) + ((this.g > 15) ? '' : '0') + this.g.toString(16) + ((this.b > 15) ? '' : '0') + this.b.toString(16);
		this._changed = false;
	}

	return this._hex;
};
Color.prototype.beHex = function(hex) {
	this._hex = hex;
	this._changed = false;
	this.r = parseInt( hex.substring(1, 3), 16);
	this.g = parseInt( hex.substring(3, 5), 16);
	this.b = parseInt( hex.substring(5, 7), 16);

	this._r = this.r;
	this._g = this.g;
	this._b = this.b;
};
Color.prototype.become = function(color) {
	this.r = color.r;
	this.g = color.g;
	this.b = color.b;

	this.bake();

	this._changed = true;
};
Color.prototype.bake = function() {
	this._r = this.r;
	this._g = this.g;
	this._b = this.b;
};

Color.prototype.reset = function() {
	this.r = this._r;
	this.g = this._g;
	this.b = this._b;

	this._changed = true;
};
Color._temp = { r: 0, g: 0, b: 0 };
Color.hex2RGB = function(hex) {
	Color._temp.r = parseInt( hex.substring(1, 3), 16);
	Color._temp.g = parseInt( hex.substring(3, 5), 16);
	Color._temp.b = parseInt( hex.substring(5, 7), 16);

	return Color._temp;
};

module.exports = Color;
},{}],9:[function(require,module,exports){
var Color = require('../util/color');

var DrawBuffer = function(w, h) {

	if (w && h) this.setBuffer(new ArrayBuffer(w * h * 18), w, h);

	this.offset = 0;
	this._read = { t: { c: null, f: null, b: null }, x: null, y: null };
	this._f = new Color('#000000');
	this._b = new Color('#000000');
};

DrawBuffer.prototype.setBuffer = function(buffer, w, h) {
	this.buffer = buffer;
	this.width = w;
	this.height = h;

	this.reader = new Uint16Array(this.buffer);
	this.length = this.reader.length;
};

DrawBuffer.prototype.read = function() {

	if (this.offset === this.length) {
		this.offset = 0;
		return null;
	}

	this._read.t.c = this.reader[this.offset++];

	this._f.become({
		r: this.reader[this.offset++],
		g: this.reader[this.offset++],
		b: this.reader[this.offset++]
	});
	this._read.t.f = this._f.toHex();

	this._b.become({
		r: this.reader[this.offset++],
		g: this.reader[this.offset++],
		b: this.reader[this.offset++]
	});
	this._read.t.b = this._b.toHex();

	this._read.x = this.reader[this.offset++];
	this._read.y = this.reader[this.offset++];

	if (this._read.t.c === 114) {
		console.log();
	}

	return this._read;
};
DrawBuffer.prototype.write = function(x, y, t) {

	var offset = x * y * 18;

	if (t.c) this.reader[offset++] = t.c;
	else offset++;

	if (t.f) {
		this.reader[offset++] = t.f.r;
		this.reader[offset++] = t.f.g;
		this.reader[offset++] = t.f.b;
	} else offset += 3;

	if (t.b) {
		this.reader[offset++] = t.b.r;
		this.reader[offset++] = t.b.g;
		this.reader[offset++] = t.b.b;
	} else offset += 3;

	this.reader[offset++] = x;
	this.reader[offset++] = y;

	if (offset === this.length) {
		offset = 0;
	}
};

DrawBuffer.prototype.afk = function() {
	return (this.reader.buffer.byteLength === 0);
};

module.exports = DrawBuffer;
},{"../util/color":8}],10:[function(require,module,exports){
var x,
	y;

/**
 * create mutli-dimensional array
 * @param  {int} x    x dimensions
 * @param  {int} y    y dimensions
 * @param  {function} factory what to init every cell to
 * @return {Array}      returns newly initialized array
 */
var Marray = function(w, h, factory, old) {
	var a = [];
	x = -1;
	while (++x < w) {
		y = -1;
		a.push([]);
		while (++y < h) {
			a[x].push( (old && old[x] && old[x][y]) ? factor(old) : factory(x, y, a) );
		}
	}
	return a;
};

module.exports = Marray;
},{}]},{},[2]);

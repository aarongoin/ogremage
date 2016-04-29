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
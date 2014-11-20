define(["./console", "../core/handler"], function(con, han) {
    var input = {},
        w, h,
        current = [],
        lastTap = null,
        mgTimerID = null;

    /**
     * gets all current touches that have changed with callback hook
     * @param  {object}   event    [description]
     * @param  {Function} callback parameters: changedTouch, current index
     */
    var changedCurrent = function(event, callback) {
        var i, j;
        i = event.changedTouches.length;
        while (i--) {
            t = event.changedTouches[i];
            j = current.length;
            while (j--) if (t.id === current[j].id) callback(changed, index);
        }
    };

    /**
     * calculate x and y tile coords being touched
     * @param  {object} touch touch event to be modified
     * @return {object}       returns modified touch object
     */
    var touchTile = function(touch) {
        touch.tileX = Math.round(touch.screenX / con.pixel);
        touch.tileY = Math.round(touch.screenY / con.pixel);
        return touch;
    };

    /**
     * mostly just passing the beginning of a gesture along to the handler
     * @param  {array} added touches making up gesture
     * @param  {boolean} mouse if this is a mouse event
     */
    var gestureBegin = function(added, mouse) {
        var i, gesture = [];

        gesture.isMouse = mouse || false;
        gesture.recognized = (mouse) ? added.recognized : "unknown";

        i = added.length;
        while (i--) gesture.push( added[i] );

        gesture.state = "begin";
        han(gesture);
    };

    /**
     * mostly just passing the movement of a gesture along to the handler
     * @param  {array} moved touches making up gesture movement
     * @param  {boolean} mouse if this is a mouse event
     */
    var gestureMove = function(moved, mouse) {
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
            t.speed = t.dis / t.dt;

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

        gesture.speed = gesture.distance / gesture.dt;

        if (!mouse || (mouse && moved.recognized === "simple")) {
            gesture.recognized = (gesture.speed > 50) ? "Swipe" : "Drag";
        } else {
            gesture.recognized = moved.recognized;
        }

        gesture.state = "moving";
        han(gesture);
    };

    /**
     * detecting final recognized type of an ending gesture and pass along to the handler
     * @param  {array} removed touches making up gesture
     * @param  {boolean} mouse if this is a mouse event
     */
    var gestureEnd = function(removed, mouse) {
        var i, g, t, len,
            gesture = [];

        gesture.isMouse = mouse || false;
        gesture.recognized = (mouse) ? removed.recognized : "unknown";

        gesture.tileX = 0;
        gesture.tileY = 0;
        gesture.distance = 0;
        gesture.speed = 0;
        gesture.dt = 0;

        i = len;
        while (i--) {
            g = {};
            t = removed[i];

            g.dx = t.tileX - t.tileX0;
            g.dy = t.tileY - t.tileY0;
            g.dt = t.end - t.start;

            g.distance = Math.sqrt( square(g.dx) + square(g.dy) );
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

        gesture.speed = gesture.distance / gesture.dt;

        // detect touch type
        // TODO - recognize pinch and rotate gestures along with directionality for non-mouse gestures
        if (!mouse || (mouse && moved.recognized === "simple")) {
            if (gesture.distance < 50) {
                if (gesture.dt > 1000) {
                    gesture.recognized = "Hold";
                } else if ((lastTap) &&
                           (Date.now() - lastTap.end < 300) &&
                           (lastTap.count === gesture.length) &&
                           (lastTap.tileX === gesture.tileX) &&
                           (lastTap.tileY === gesture.tileY)) {
                    gesture.recognized = "Double";

                    // ensure we cannot fire a doubletap immediately after another doubletap
                    lastTap = null;
                } else {
                    gesture.recognized = "Tap";

                    // save this tap for detecting doubletap
                    lastTap = {
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
        han(gesture);
    };

    /**
     * touchstart event callback --handles beginning touches
     * @param  {object} event dom event object
     */
    var touchStart = function(event) {
        var i, j, t, fresh;
        event.preventDefault();

        // ignore any touches beyond the first three
        if (current.length > 2) return;

        fresh = (current.length) ? false : true;

        // add new touches until we have three or there are no more to add
        i = 0;
        j = event.changedTouches.length;
        while (i < j) {
            t = event.changedTouches[i];
            t.start = Date.now();
            touchTile(t); // set touch x and y tile coords
            t.tileX0 = t.tileX;
            t.tileY0 = t.tileY;
            current.push(t);
            if (current.length === 3) break;
        }

        if (fresh) gestureBegin(current);
    };

    /**
     * touchmove event callback --handles moving touches
     * @param  {object} event dom event object
     */
    var touchMove = function(event) {
        var moved = [];
        event.preventDefault();

        // find changed current touches
        changedCurrent(event, function(changed, index) {
            touchTile(changed); // set touch x and y tile coords
            moved.push(changed); // grab the moved touch
        });

        gestureMove(moved);
    };

    /**
     * touchend event callback --handles ending touches
     * @param  {object} event dom event object
     */
    var touchEnd = function(event) {
        var i, j, t, removed = [];
        event.preventDefault();

        // find changed current touches
        changedCurrent(event, function(changed, index) {
            changed.end = Date.now(); // ending time of touch
            touchTile(changed); // set touch x and y tile coords
            removed.concat( current.splice(index + 1, 1) ); // delete the finished touch
        });

        // if no touches left, detect final touch type
        if (current.length === 0) gestureEnd(removed);
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
    var mouseDown = function(event) {
        var i, l = current.length,
            touch, mod;
        event.preventDefault();

        // ignore mouse if we already have three touches or if button pressed was not among the first three
        if ((l > 2) || (event.which > 3)) return;

        // create a touch object for the mouse
        touch = {
              start: Date.now(),
                 id: event.which,
            screenX: event.screenX,
            screenY: event.screenY
        };

        // set touch x and y tile coords
        touchTile(touch);
        touch.tileX0 = touch.tileX;
        touch.tileY0 = touch.tileY;

        // get only one modifier key
        // WARNING - given nature of touch spoofing: ctrl + button-1 followed by shift + button-2
        //           will result in a 3-touch rotation gesture because the shift will overwrite the ctrl
        // TODO - handle both at the same time for pinch-rotate gesture
        mod = (event.ctrlKey  && !event.shiftKey) ? "Pinch" :
              (event.shiftKey && !event.ctrlKey) ? "Rotate" : null;
        current.recognized = (mod && l > 1) ? mod : "Simple";
        // mouse has small advantage here to touch because based on the
        // presence of modifier keys, we can actually infer complex gestures

        // spoofing i touches where i is the button number
        i = touch.id;
        while (i--) current.push(touch);

        // set timeout if less than 3 touches or if there's already a timeout set for the gesture
        // because each button-press fires it's own event, this gives the user time to press all the desired buttons
        l = current.length;
        if ((l < 3) && (!mgTimerID)) {
            mgTimerID = setTimeout(function() {
                if (current.length === l) gestureBegin(current, true);
                mgTimerID = null;
            }, 200); // 1/5th of a second
        } else {
            gestureBegin(current, true);
        }
    };

    /**
     * mousemove event callback -- multi-touch polyfill
     * @param  {object} event dom event object
     */
    var mouseMove = function(event) {
        var t, i = current.length;
        // ignore mouse movement if the user isn't clicking
        if (i) {
            // update each touches x and y tile coordinates
            while (i--) {
                t = current[i];
                t.screenX = event.screenX;
                t.screenY = event.screenY;
                touchTile(t);
            }
            gestureMove(current, true);
        }
    };

    /**
     * mouseup event callback -- multi-touch polyfill
     * @param  {object} event dom event object
     */
    var mouseUp = function(event) {
        var t, i = current.length,
            removed;
        // ignore mouseup if the user isn't clicking one of first 3 buttons
        if (i) {
            // update each touches x and y tile coordinates and get time touch ended
            while (i--) {
                t = current[i];
                t.end = Date.now();
                t.screenX = event.screenX;
                t.screenY = event.screenY;
                touchTile(t);
            }
            removed = current;
            current = [];
            gestureMove(removed, true);
        }
    };

    /**
     * initialize input module
     * @param  {boolean} mouse  whether input listens for mouse events or touch events
     */
    input.init = function(mouse) {

        console.log("init: input");
        if (mouse) {
            canvas.addEventListener("mousedown", mouseDown);
            canvas.addEventListener("mousemove", mouseMove);
            canvas.addEventListener("mouseup", mouseUp);
        } else {
            canvas.addEventListener("touchstart", touchStart);
            canvas.addEventListener("touchmove", touchMove);
            canvas.addEventListener('touchend', touchEnd);
        }
    };

    return input;
});
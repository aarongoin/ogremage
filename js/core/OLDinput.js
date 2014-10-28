define(["./canvas"], function(canvas) {
    console.log("prep: input");
    // PRIVATE CLOSURE
    var finger = {},
        contacts = [],
        others = [],
        targets = [],
        active = false,
        inactive;

    var checkSquares = function(x, y, array) {
        array = array || contacts;
        var s = [],
            c = {},
            i = array.length;
        while (i--) {
            c = array[i];
            if (c.x < x &&
                c.y < y &&
                (c.x + c.w) > x &&
                (c.y + c.h) > y) {

                s.push(c);
            }
        }
        return s;
    };

    var touchStart = function(event) {
        event.preventDefault();

        if (event.touches.length === 1) {
            finger = {};
            finger.x0 = finger.x = event.touches[0].pageX;
            finger.y0 = finger.y = event.touches[0].pageY;
            finger.id = event.touches[0].identifier;
            finger.start = performance.now();

            if (active) {
                targets = checkSquares(finger.x, finger.y);
                console.log("touchstart: " + targets.length + " targets");
                if (targets) {
                    i = targets.length;
                    while (i--) {
                        targets.event("touch", finger);
                    }
                } else { // call non-target-touch callback(s)
                    i = others.length;
                    while (i--) {
                        others[i]("touch", finger);
                    }
                }
            } else {
                if (inactive) inactive("touch", finger);
            }
        }
    };

    var touchEnd = function(event) {
        event.preventDefault();

        if (event.touches.length === 0) {
            finger.x = event.changedTouches[0].pageX;
            finger.y = event.changedTouches[0].pageY;
            finger.end = performance.now();

            var dx = finger.x - finger.x0,
                dy = finger.y - finger.y0,
                movement = Math.sqrt(dx + dy),
                dt = finger.start - finger.end,
                type = "",
                i = 0;

            if (movement < 50) {
                if (dt > 1000) {
                    type = "hold";
                } else {
                    type = "tap";
                }
            } else {
                if (dx > dy) {
                    type = (dx > 0) ? "swipe-right" : "swipe-left";
                } else {
                    type = (dy > 0) ? "swipe-down" : "swipe-up";
                }
            }

            if (active) {
                targets = checkSquares(finger.x, finger.y, targets);
                if (targets.length) {
                    for (i = targets.length - 1; i >= 0; i--) {
                        targets.event(type, finger);
                    }
                } else { // call non-target-touch callbacks
                    for (i = others.length - 1; i >= 0; i--) {
                        (others[i](type, finger));
                    }
                }
            } else {
                if (inactive) inactive(type, finger);
            }
        }
    };

    var mouseDown = function(mouse) {
        var e = {};
            e.preventDefault = mouse.preventDefault;
            e.touches = [{pagex: mouse.screenX, pageY: mouse.screenY}];
            e.touches[0].identifier = Date.now();
            e.changedTouches = e.touches;

        touchStart(e);

    };

    var mouseUp = function(mouse) {
        var e = {};
            e.preventDefault = mouse.preventDefault;
            e.changedTouches = [{pagex: mouse.screenX, pageY: mouse.screenY}];
            e.changedTouches[0].identifier = Date.now();
            e.touches = [];

        touchEnd(e);
    };

    // PUBLIC API
    return {
        /**
         * initialize touch handling
         * @param  {element} canvas canvas to attach touch listening to
         * @param  {boolean} mouse support mouse instead of touches
         */
        init: function(canvas, mouse) {
            mouse = mouse || false;
            console.log("init: input");
            if (mouse) {
                canvas.addEventListener("mousedown", mouseDown);
                canvas.addEventListener("mouseup", mouseUp);
            } else {
                canvas.addEventListener("touchstart", touchStart);
                canvas.addEventListener('touchend', touchEnd);
            }
            active = true;
        },
        /**
         * add new touchable contact of square shape
         * @param  {object} object MUST conform to type {'x': #, 'y': #, 'w': #, 'h': #}
         */
        add: function(object) {
            var i = contacts.indexOf(object);
            if (i === -1) contacts.push(object);
        },

        /**
         * register callback for null touches (touches that hit no registered contacts)
         * @param  {function} callback will be sent 2 vars: touch type (string), and finger (object)
         */
        other: function(callback) {
            var i = others.indexOf(callback);
            if (i === -1) others.push(callback);
        },

        /**
         * remove a contact from the list
         * @param  {object} object object to be removed
         */
        remove: function(object) {
            var i = contacts.indexOf(object);
            if (i !== -1) {
                contacts.splice(i, 1);
                i = targets.indexOf(object);
                if (i !== -1) targets.splice(i, 1);
            }
        },

        /**
         * activate touch handling
         */
        activate: function() {
            inactive = undefined;
            active = true;
        },

        /**
         * deactivate touch handling
         * @param  {Function} callback optional callback for touches detected during inactivity
         *                             callback will be sent touch type and finger
         *                             accepts single callback only
         */
        deactivate: function(callback) {
            inactive = callback;
            active = false;
        }
    };
});
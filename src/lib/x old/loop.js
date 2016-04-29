"use strict";
define(function() {
    console.log("loop: init module");
        var callbacks = [],
            timeout = [],
            active = false,
            x,
            t,
            dt,
            anim = (function() {
                return window.requestAnimationFrame ||
                       window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame ||
                       window.oRequestAnimationFrame ||
                       window.msRequestAnimationFrame ||
                       function(callback){ window.setTimeout(callback, 1000 / 60); };
            }()),

            async = function(callback) {
                console.log("loop: adding async callback");
                timeout.push(callback);
            },

            block = function(callback) {
                console.log("loop: adding callback to loop");
                callbacks.push(callback);
            },

            /*
            exec_async = (function() {
                var call = [],
                    handle = function(event) {
                        if (event.source === window && event.data === "ztm") {
                            event.stopPropagation();
                            if (call.length > 0) {
                                (call.pop())(); // pop callback off stack and invoke it
                            }
                        }
                    };

                window.addEventListener("message", handle, false);

                return function(callback) {
                    call.push(callback);
                };
            }()), */

            main = function(t) {
                t = t || 0;
                var i;
                x = x || t;
                dt = (t - x);
                x = t;

                i = callbacks.length;
                while (i--) callbacks[i](dt);
                //i = timeout.length;
                //while (i--) exec_async(timeout[i]);
                if (active) anim(main);
            };

        return {
            /**
             * add function to loop
             * @param {function} callback function will  be passed delta time as argument
             * @param {boolean} draw BROKEN. DO NOT USE. true if a blocking call, defaults to true (async)
             */
            add: function(callback, draw) {
                draw = draw || true;

                if (draw) { block(callback); } else { async(callback); }
                if (!active) {
                    console.log("loop: starting...");
                    active = true;
                    main();
                }
            },

            remove: function(callback) {
                var i = callbacks.indexOf(callback);
                if (i !== -1) callbacks.splice(i, 1);
                i = async.indexOf(callback);
                if (i !== -1) timeout.splice(i, 1);
                if ((callbacks.length === 0) && (async.length === 0)) active = false;
            },

            pause: function() {
                active = !active;
                if (active) {
                    console.log("loop: starting...");
                    main();
                } else {
                    console.log("loop: pausing...");
                }
            }
        };
    });
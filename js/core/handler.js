define(function() {
    var handle,
        gestures,
        active = false,
        inactive;

    // callbacks for bound gestures
    gestures = {
        // single touch gesture callbacks
        t1Tap: handle.logGesture,
        t1Hold: handle.logGesture,
        t1Double: handle.logGesture,
        t1Drag: handle.logGesture,
        t1Swipe: handle.logGesture,

        // double touch gesture callbacks
        t2Tap: handle.logGesture,
        t2Hold: handle.logGesture,
        t2Double: handle.logGesture,
        t2Drag: handle.logGesture,
        t2Swipe: handle.logGesture,
        t2Pinch: handle.logGesture,
        t2Rotate: handle.logGesture,

        // triple touch gesture callbacks
        t3Tap: handle.logGesture,
        t3Hold: handle.logGesture,
        t3Double: handle.logGesture,
        t3Drag: handle.logGesture,
        t3Swipe: handle.logGesture,
        t3Pinch: handle.logGesture,
        t3Rotate: handle.logGesture
    };

    handle = function(gesture) {
        var type;
        if (active) {
            type = "t" + gesture.length + gesture.recognized;
            handle.gesture = gesture;
            if (handle[type]) handle[type](gesture);
        } else inactive(gesture);
    };

    handle.logGesture = function(gesture) {
        console.log("gesture: " + gesture.recognized);
        console.log("touches: " + gesture.length);
    };

    handle.set = function(gesture, callback) {
        if (handle[gesture] && (typeof callback === "function")) handle[gesture] = callback;
    };

    handle.start = function() { active = true; };

    handle.stop = function() { active = false; };

    handle.inactive = function(callback) { inactive = callback; };

    return handle;
});
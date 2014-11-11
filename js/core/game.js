define(["console", "loop", "handle", "local", "time"],
function(console, loop, handle, local, time) {
    var game = {},
        states = {
            "loading": [],
            "loaded": []
        };

    console.ready = function() {
        game.setState("loaded");
        loop.add(game.update, true);
    };

    game.setState = function(state) {
        var i;
        // ignore if setting to same state
        if (this.state !== states[state]) {
            // set state
            this.state = states[state];

            // fire callbacks for this state change
            i = this.state.length;
            while (i--) this.state[i]();
        }
    };

    game.onState = function(state, callback) {
        // verify that the state exists
        if (states[state]){
            states[state].push(callback);
            return true;
        } else return false;
    };

    game.update = function(dt) {

    };

    return game;
});
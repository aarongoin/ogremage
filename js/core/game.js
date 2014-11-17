define(["../display/console", "../util/loop", "./handle", "./local", "./clock", "./menu"],
function(console, loop, handle, local, clock, menu) {
    var game = {},
        states = {
            "ready": function() {
                menu.init();
            },
            "play": function() { loop.add(game.update, true); }
        };

    game.init = function(sprites, pixel) {
        console.ready = function() {
            game.setState("ready");
            console.run(true);
        };
        console.init(canvas.ctx(), canvas.dim(), "./img/sprites20c.png", 20);
        menu.create({
            title: "Main Menu",
            buttons: [
                {title: "Start", click: function() { game.setState("play"); }}
            ],
        });
    };

    game.setState = function(state) {
        // ignore if state is not valid or if setting to same state
        if (states[state] && (this.state !== states[state])) {

            // set new state
            this.state = states[state];

            // fire callbacks for beginning state
            if (this.state) this.state();
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
        var delta = clock.tick();
        local.update(delta);
    };

    return game;
});
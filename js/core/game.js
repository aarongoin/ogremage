define(["./display", "../util/loop", "./handle", "./local", "./clock", "./menu", "../entity/player"],
function(display, loop, handle, local, clock, menu, player) {
    var game = {},
        states = {
            "ready": function() {
                menu.show("Main Menu");
            },
            "play": game.start
        };

    game.init = function(sprites, pixel) {

        // create our main menu
        menu.create({
            title: "Main Menu",
            buttons: [
                {title: "Start", click: function() { game.setState("play"); }}
            ],
        });

        // set default handlers
        handle.set("t1Tap", player.moveTo);
        handle.set("t1Hold", player.Act);
        handle.set("t1Double", player.moveToAndAct);

        // initialize our display with mouse gestures
        display.init(sprites, pixel, true, function() { game.setState("ready"); });
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

    game.start = function() {
        loop.add(game.update, true);
    };

    game.update = function(dt) {
        var delta = clock.tick();
        local.update(delta);
    };

    return game;
});
define(["../display/console", "../util/loop", "./handle", "./local", "./clock", "./menu", "./player"],
function(console, loop, handle, local, clock, menu, player) {
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
        console.init(canvas.ctx(), canvas.dim(), "./img/sprites" + pixel + "c.png", pixel);
        menu.create({
            title: "Main Menu",
            isMain: true,
            buttons: [
                {title: "Start", click: function() { game.setState("play"); }}
            ],
        });

        handle.set("t1Tap", player.moveTo);
        handle.set("t1Hold", player.interact);
        handle.set("t1Double", player.moveToAndAct);
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
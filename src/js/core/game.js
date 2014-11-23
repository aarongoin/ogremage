define(["./display", "../util/loop", "./handler", "./local", "./clock", "./menu", "./player"],
function(display, loop, handle, local, clock, menu, player) {
    var game = {},
        states;

    game.init = function(sprites, pixel) {
        console.log("game: init");

        // initialize our display with mouse gestures
        display.init(sprites, pixel, true, function() {
            /*
            // create our main menu
            menu.create({
                title: "Main Menu",
                buttons: [
                    {title: "Start", click: function() { game.setState("play"); }}
                ],
            });
            console.log("menu create");
            */
            
            // set default handlers
            handle.set("t1Tap", player.moveTo);
            //handle.set("t1Hold", player.Act);
            //handle.set("t1Double", player.moveToAndAct);

            game.setState("ready");
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

    game.start = function() {
        console.log("game: starting");
        local.init({
            // where to place player
            player: {
                states: {
                 "active": {t: "active", c: 2, f: 7, F: 66},
                "dormant": {t: "dormant", c: 2, f: 7, F: 66},
                   "dead": {t: "dead", c: 2, f: 7, F: 66}
                }
            },

            // how to color the map as well as environmental effects
            scene: {
                global: "rgba(1, .7, .3, .5)",
                 gloom: 0,
                   fog: 0,
                  rain: 0,
                  wind: 0
            },
            // map generation variables
            map: {
                  type: "arena",
                 width: display.width(),
                height: display.height(),
                  wall: {c: 35, f: 3, b: 0},
                 floor: {c: 46, f: 1, b: 0}
            }
        });
        handle.start();

        loop.add(game.update, true);
    };

    states = {
        ready: function() {
            //menu.show("Main Menu");
            console.log("game: ready");
            game.setState("play");
        },
        play: game.start
    };

    return game;
});
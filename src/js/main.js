require(["./display/alphanum", "./display/canvas", "./display/console", "./util/colorwheel", "./util/random", "./util/loop", "./core/game"],
function(alphanum, canvas, con, color, rand, lupe, game) {
    console.log("main: init module");
    var dim, x, y, z, t = {},
        ogremage = alphanum.spritesFromString("OGREMAGE"),

        test = function(dt) {
            dim = con.dim();
            x = dim[0];

            while(x--) {
                y = dim[1];
                while(y--) {
                    if ((y === 10) && (x < 10) && (x > 1)) {
                        t.c = (rand.simple(0, 100) < 95) ? ogremage[x - 2] : rand.lfsr(0, 256);
                        t.f = (rand.simple(0, 100) < 95) ? 5 : color.color();
                    } else {
                        t.c = rand.lfsr(0, 256);
                        t.f = color.color();
                    }
                    t.b = color.gray();
                    con.swap(x, y, t);
                }
            }
            
        };

    /*
    con.ready = function() {
        con.run(true);
        lupe.add(test, true);
    };
    con.init("./img/sprites30c.png", 30);
    */
   
    game.init("./img/sprites20c.png", 20);

    /*
    var b = document.getElementById('pause');

    b.onclick = function() {
        b.innerHTML = (b.innerHTML === "pause") ? "resume" : "pause";
        lupe.pause();
    };
    */
});
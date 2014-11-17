require(["./display/canvas", "./display/console", "./util/colorwheel", "./util/random", "./util/loop"],
function(canvas, con, color, rand, lupe) {
    console.log("exec: main");
    var dim, x, y, z, t = {},

        test = function(dt) {
            dim = con.dim();
            x = dim[0];

            while(x--) {
                y = dim[1];
                while(y--) {
                    t.c = rand.lfsr(0, 256);
                    t.f = color.color();
                    t.b = color.color();
                    con.swap(x, y, t);
                }
            }
        };

    con.ready = function() {
        con.run(true);
        lupe.add(test, true);
    };
    con.init(canvas.ctx(), canvas.dim(), "./img/sprites20c.png", 20);
    /*canvas.resize = function() { con.resize(canvas.dim()[0], canvas.dim()[1], true); };
    */
   var b = document.getElementById('pause');

   b.onclick = function() {
        b.innerHTML = (b.innerHTML === "pause") ? "resume" : "pause";
        lupe.pause();
    };
});
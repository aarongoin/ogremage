define(["./canvas", "../util/loop", "../util/colorwheel", "../util/sma"], function(canvas, lupe, color, sma) {
    console.log("prep: console");
    var c = {},
        redraw = [], // tiles that need redrawn [x, y, draw flag]
        ctx = canvas.ctx(), // canvas context
        sprites = new Image(), // image object containing spritesheet
        tiles = [], // objects holding a tile object
        width, // number of tiles wide (x values)
        height, // number of tiles tall (y values)
        mx, // top margin (letterboxing) in pixels
        my, // left margin (letterboxing) in pixels

        fps = document.getElementById('fps'),
        avg = sma(180), // initialize our simple moving average calculator


        /**
         * single tile canvas draw method
         * @param  {object} tile {x: , y: , c: , f: , b: }
         */
        blit = function(tile, flag) {
            var x = tile.x,
                y = tile.y,
                p = c.pixel;

            if ((flag & 8) && (tile.c !== 0)) { /*custom fore && non-empty*/
                // clear tile
                ctx.clearRect(x, y, p, p);
                // clipping mask
                ctx.drawImage(sprites, tile.c * p, 0, p, p, x, y, p, p);

                ctx.globalCompositeOperation = 'source-atop';

                // forground color (painted only within the clipping mask)
                ctx.fillStyle = color.at(tile.f);
                ctx.fillRect(x, y, p, p);

                ctx.globalCompositeOperation = 'destination-over';
            }

            // draw background?
            if (flag & 4) {
                // background color
                ctx.fillStyle = (flag & 16) ? tile.b : color.at(tile.b);
                ctx.fillRect(x, y, p, p);
            }

            if (flag & 8) {
                ctx.globalCompositeOperation = 'source-over';
            } else if ((flag & 3)) {
                // draws only if non-blank char
                ctx.drawImage(sprites, tile.c * p, tile.f * p, p, p, x, y, p, p);
            }
        },

        /**
         * redraw all tiles at coords in redraw array
         * @param  {number} time timestamp of call
         */
        render = function(time) {
            var c, t;
            t = Date.now();
            ctx.globalCompositeOperation = 'source-over';
            while ((c = redraw.shift())) { // pull next tile coords to redraw
                blit(tiles[c[0]][c[1]], c[2]); // use coords to blit correct tile
            }

            fps.innerHTML = "FPS: " + (1000 / avg(Date.now() - t) >> 0);
        },

        forceDraw = function() {
            var x = width,
                y;
            console.log("console force draw");
            while (x--) {
                y = height;
                while (y--) {
                    redraw.push([x, y, 7]);
                }
            }
        },

        /**
         * check if tile at coord is already flagged for redraw
         * @param  {number} x x-coord in tiles
         * @param  {number} y y-coord in tiles
         * @param  {number} flag draw type flags
         */
        needRedraw = function(x, y, flag) {
            var i = redraw.length, tile, draw = true;
            while (i--) {
                tile = redraw[i];
                if ((x === tile[0]) && (y === tile[1])) {
                    tile[3] |= flag;
                    draw = false;
                    break;
                }
            }
            if (draw) redraw.push([x, y, flag]);
        };

    sprites.addEventListener("load", function() {
        console.log("console ready");
        forceDraw();
        c.ready();
    }, false);

    /**
     * replace a single tile at coords
     * @param  {number} x x-coord of tile
     * @param  {number} y y-coord of tile
     * @param  {object} t tile containing only non-coordinate data
     *                    {c: , f: , b: }
     * @return {boolean}   true if swapped, false if no change needed
     */
    c.swap = function(x, y, t) {
        var c = tiles[x][y], // get original tile
            F = 0; // draw flags

        // change char?
        if ((t.c !== undefined)) {
            c.c = t.c;
            F |= 1;
        }

        // change foreground color?
        if ((t.f !== undefined) && (t.f !== c.f)) {
            c.f = t.f;
            F |= 2;
            if (typeof t.f === String) F |= 8;
        }

        // change background color?
        if ((t.b !== undefined) && (t.b !== c.b)) {
            c.b = t.b;
            F |= 4;
            if (typeof t.b === String) F |= 16;
        }

        if (F & 0) return false;

        // flag for redraw
        needRedraw(x, y, F);
        return true;
    };

    c.line = function(x0, y0, x1, y1, t) {
        var m, b,
            dx = (x1 - x0),
            dy = (y1 - y0);

        if (dx === 0) { // vertical line
            while (y0 <= y1) {
                c.swap(x0, y0);
                y0++;
            }
        } else if (dy === 0) { // horizontal line
            while (x0 <= x1) {
                c.swap(x0, y0);
                x0++;
            }
        } else { // angled lines
            m = dy / dx;
            if (m >= 1) {
                b = x0 - (y0 * m);
                while (y0 <= y1) {
                    c.swap(x0, y0);
                    y0++;
                    x0 = Math.round((m * y0) + b);
                }
            } else { // m >= 1
                b = y0 - (x0 * m);
                while (x0 <= x1) {
                    c.swap(x0, y0);
                    x0++;
                    y0 = Math.round((m * x0) + b);
                }
            }
        }
    };

    /**
     * redraw many tiles at once
     * @param  {Array} m objects to redraw
     *                   {x: , y: , c: , f: , b: }
     */
    c.draw = function(m) {
        var t;
        while ((t = m.pop())) { c.swap(t.x, t.y, t); }
    };

    c.init = function(sprite_src, char_px, ready) {
        console.log("init: console");

        c.ready = ready || c.ready;

        console.log("sprites src: " + sprite_src + " pixels: " + char_px);
        var w = canvas.width,
            h = canvas.height,
            x, y, i, j;

        // set up console private vars
        ctx = canvas.ctx();
        sprites.src = sprite_src;
        c.pixel = char_px; // number of pixels wide/tall a tile is
        c.resize(w, h);

        console.log("tiles wide: " + width + " tall: " + height);
        console.log("x margin: " + mx + " y margin: " + my);

        // fill canvas black ( sets up letterboxing)
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);

        console.log("creating " + (width * height) + " tiles");
        // initialize tiles
        x = mx;
        for (i = 0; i < width; i++) {
            tiles.push([]);
            y = my;
            for (j = 0; j < height; j++) {
                tiles[i].push({ c: 0, // sprite number within sprite sheet
                                x: x, // x coord in pixels
                                y: y,  // y coord in pixels
                                f: 5, // foreground color
                                b: 5}); // background color
                y += c.pixel;
            }
            x += c.pixel;
        }
    };

    /**
     * render the loop either continuously or just once
     * @param  {boolean} loop defaults to true, renders only once if false
     */
    c.run = function(loop) {
        loop = loop || true;
        console.log("console: run(" + loop + ")");
        if (loop) {
            lupe.add(render, true);
        } else {
            render();
        }
    };

    /**
     * stop continuous console render loop
     */
    c.stop = function() { lupe.remove(render); };

    /**
     * get console tile dimensions
     * @return {Array} array holding width and height
     */
    c.dim = function() { return [width, height, c.pixel]; };

    c.clear = function(rgba) {
        ctx.fillStyle = rgba;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    /**
     * overload to get notice of console ready state
     */
    c.ready = function() {};

    c.blit = function(tile) { blit(tile); };

    c.resize = function(w, h, trim) {
        var old_w = width, old_h = height;
        trim = trim || false;
        this.width = width = (w / c.pixel) >> 0;
        mx = ((w - width * c.pixel) / 2) >> 0;
        this.height = height = (h / c.pixel) >> 0;
        my = ((h - height * c.pixel) / 2) >> 0;
        /*
        if (trim) {
            old_w -= width;
            old_h -= height;
            if (old_w > 0) {
                if (old_h > 0) { // width and height more

                } else { // width more, but height less

                }
            } else  if (old_h > 0) { // width less, but height more

            } else { // width and height less
                tiles.splice(width, (old_w * -1));
                old_w = width;
                while (old_w--) {
                    tiles.splice(height, (old_h * -1));
                }
            }
            forceDraw();
        }*/
    };

    return c;
});
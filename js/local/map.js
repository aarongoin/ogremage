define(["../util/marray", "./flags"],
function(marray, flags) {
    var map = {data: null};

    map.init = function(init) {
        var x, y, c, f,
            w = init.width,
            h = init.height;

        console.log("map: init");

        this.data = marray(w, h, function() {
            return {
                       c: init.floor.c,
                       f: init.floor.f,
                       b: 0,
                       F: 1,
                       a: true,
                occupied: false,
                   space: 0
            };
        });

        console.log("" + this.data[0][0].F);
        this.width = w;
        this.height = h;

        if (init.type === "arena") {
            console.log("map: init arena");
            // create walls around map
            c = init.wall.c;
            f = init.wall.f;
            x = 0;
            y = 0;
            w--;
            h--;
            while (x <= w) {
                this.data[x][0].c = c;
                this.data[x][0].f = f;
                this.data[x][0].F |= flags.ISWALL;
                this.data[x][h].c = c;
                this.data[x][h].f = f;
                this.data[x][h].F |= flags.ISWALL;
                x++;
            }
            while (y <= h) {
                this.data[0][y].c = c;
                this.data[0][y].f = f;
                this.data[0][y].F |= flags.ISWALL;
                this.data[w][y].c = c;
                this.data[w][y].f = f;
                this.data[w][y].F |= flags.ISWALL;
                y++;
            }
        }
    };

    map.tileOpen = function(x, y) {
        return this.data[x][y].occupied ? this.data[x][y] : false;
    };

    map.cycleOpen = function(callback) {
        var node, w, h;

        w = this.width;
        while (w--) {
            h = this.height;
            while (h--) {
                node = this.data[w][h];
                if (!node.occupied) callback(w, h, node);
            }
        }
    };

    map.border8 = function(x, y) {
        var border = [],
            tile;

        // top left
        tile = this.data[x-1][y-1];
        if (tile) {
            tile.dx = -1;
            tile.dy = -1;
            border.push(tile);
        }

        // left
        tile = this.data[x-1][y];
        if (tile) {
            tile.dx = -1;
            tile.dy = 0;
            border.push(tile);
        }

        // bottom left
        tile = this.data[x-1][y+1];
        if (tile) {
            tile.dx = -1;
            tile.dy = 1;
            border.push(tile);
        }

        // bottom
        tile = this.data[x][y+1];
        if (tile) {
            tile.dx = 0;
            tile.dy = 1;
            border.push(tile);
        }

        // bottom right
        tile = this.data[x+1][y+1];
        if (tile) {
            tile.dx = 1;
            tile.dy = 1;
            border.push(tile);
        }

        // right
        tile = this.data[x+1][y];
        if (tile) {
            tile.dx = 1;
            tile.dy = 0;
            border.push(tile);
        }

        // top right
        tile = this.data[x+1][y-1];
        if (tile) {
            tile.dx = 1;
            tile.dy = -1;
            border.push(tile);
        }

        // top
        tile = this.data[x][y-1];
        if (tile) {
            tile.dx = 0;
            tile.dy = -1;
            border.push(tile);
        }

        return border;
    };

    map.open8 = function(x, y) {
        var i, border = map.border8(x, y);

        // delete any tiles that are unopen for travel
        i = border.length;
        while (i--) if (border[i].occupied) border.splice(i+1, 1);

        // if there are open tiles return them, else return false
        return (border.length) ? border : false;
    };

    map.closed8 = function(x, y) {
        var i, border = map.border8(x, y);

        // delete all open tiles
        i = border.length;
        while (i--) if (!border[i].occupied) border.splice(i+1, 1);

        // if there are closed tiles return them, else return false
        return (border.length) ? border : false;
    };

    map.balanceOf = function(x, y) {
        var balx = 0, baly = 0,
            closed, i;

        closed = map.closed8(x, y);
        i = closed.length;
        while (i--) { // get x and y balance of closed tiles
            balx += closed[i].dx;
            baly += closed[i].dy;
        }
        // square each balance
        balx *= balx;
        baly *= baly;

        // return magnitude of balance divided by number of closed tiles
        return ( Math.sqrt(balx + baly) / closed.length );
    };

    map.Occupy = function(tile, object, repr) {
        tile.occupied = object;
        tile.F &= repr.F;
    };

    map.Unoccupy = function(x, y, repr) {
        var tile = this.data[x][y];
        tile.F &= ~(repr.F);
        tile.occupied = false;
    };

    return map;
});
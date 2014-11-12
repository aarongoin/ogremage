define(["util/marray", "flags"], function(marray, flags) {
    var map;

    map.init = function(w, h) {
        var x = 0, y = 0;
        this.data = marray(w, h, function() { return {c: 1, f: 3, b: 0, F: 1, a: true, occupied: false, jam: false}; });
        map.width = w;
        map.height = h;

        // create walls around map
        w--;
        h--;
        while (x <= w) {
            this.data[x][0].c = 3;
            this.data[x][0].f = 6;
            this.data[x][0].F |= flags.ISWALL;
            this.data[x][h].c = 3;
            this.data[x][h].f = 6;
            this.data[x][h].F |= flags.ISWALL;
            x++;
        }
        while (y <= h) {
            this.data[0][y].c = 3;
            this.data[0][y].f = 6;
            this.data[0][y].F |= flags.ISWALL;
            this.data[w][y].c = 3;
            this.data[w][y].f = 6;
            this.data[w][y].F |= flags.ISWALL;
            y++;
        }
    };

    map.tileOpen = function(x, y) {
        return this.data[x][y].occupied ? this.data[x][y] : false;
    };

    map.cycleOpen = function(callback) {
        var x, y, node,
            w = this.width,
            h = this.height;

        x = 0;
        while (x < w) {
            y = 0;
            while (y < h) {
                node = this.data[x][y];
                if (!node.occupied) callback(x, y, node);
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

        return b;
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

    map.Occupy = function(tile, object, repr) {
        tile.occupied = object;
        tile.F &= repr.F;
    };

    map.Unoccupy = function(x ,y, repr) {
        var tile = this.data[x][y];
        tile.F &= ~(repr.F);
        tile.occupied = false;
    };

    return map;
});
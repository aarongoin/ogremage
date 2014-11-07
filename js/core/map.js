define(["./util/marray", "./flags"], function(marry, flags) {
    var map;

    map.init = function(w, h) {
        var x = 0, y = 0;
        map = marry(w, h, function() { return {c: 1, f: 3, b: 0, F: 1, a: true, occupied: false}; });
        map.width = w;
        map.height = h;

        // create walls around map
        w--;
        h--;
        while (x <= w) {
            map[x][0].c = 3;
            map[x][0].f = 6;
            map[x][0].F |= flags.ISWALL;
            map[x][h].c = 3;
            map[x][h].f = 6;
            map[x][h].F |= flags.ISWALL;
            x++;
        }
        while (y <= h) {
            map[0][y].c = 3;
            map[0][y].f = 6;
            map[0][y].F |= flags.ISWALL;
            map[w][y].c = 3;
            map[w][y].f = 6;
            map[w][y].F |= flags.ISWALL;
            y++;
        }
    };

    map.tileOpen = function(x, y) {
        var tile = map[x][y];
        if (tile.occupied) return false;
        return tile;
    };

    map.border8 = function(x, y) {
        var border = [],
            tile;

        // bottom left
        tile = map[x-1][y-1];
        if (tile) border.push(tile);

        // left
        tile = map[x-1][y];
        if (tile) border.push(tile);

        // top left
        tile = map[x-1][y+1];
        if (tile) border.push(tile);

        // top
        tile = map[x][y+1];
        if (tile) border.push(tile);

        // top right
        tile = map[x+1][y+1];
        if (tile) border.push(tile);

        // right
        tile = map[x+1][y];
        if (tile) border.push(tile);

        // bottom right
        tile = map[x+1][y-1];
        if (tile) border.push(tile);

        // bottom
        tile = map[x][y-1];
        if (tile) border.push(tile);

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

    map.Occupy = function(tile, object, repr) {
        tile.occupied = object;
        tile.F &= repr.F;
    };

    map.Unoccupy = function(x ,y, repr) {
        var tile = map[x][y];
        tile.F &= ~(repr.F);
        tile.occupied = false;
    };

    return map;
});
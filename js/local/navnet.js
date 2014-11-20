define(["./map"], function(map) {
    var navnet = {data: []},
        mapSpace,
        expandDiagonal,
        expandUp,
        expandLeft,
        connect;

    // TODO - guard against spaces becoming too large

    expandDiagonal = function(space) {
        var M = space.xM,
            x = space.xm,
            y = space.ym,
            expand = {left: true, up: true},
            corner, clear;

        // initial corner tile set
        corner = map.tileOpen(M, space.yM);
        while (corner) {
            // this loop is checking for barriers to expansion
            i = M - x;
            clear = true;
            while (i) {
                // check a top tile
                if (!map.tileOpen(x + i, y)) { // top blocked
                    clear = false;
                    expand.up = false; // expand left
                    break;
                // check a left tile
                } else if (!map.tileOpen(x, y + i)) { // left blocked
                    clear = false;
                    expand.left = false; // expand up
                    break;
                }
                i--;
            }
            // are we clear to expand?
            if (clear) { // all clear
                // loop expanding tiles and set their space
                corner.space = space;
                i = M - x;
                while (i) {
                    map.data[x + i][y].space = space;
                    map.data[x][y + i].space = space;
                    i--;
                }
                space.xm = --x;
                space.ym = --y;
                corner = map.tileOpen(x, y);
            } else break; // there's a barrier
        }
        return expand;
    };

    expandUp = function(space) {
        var M = space.xM,
            x = space.xm,
            y = space.ym,
            clear, i;

            while (true) {
                // check expanding edge line
                i = M - x;
                while (i) {
                    if (!map.tileOpen(x + i, y)) {
                        clear = false;
                        break;
                    }
                    i--;
                }

                // are we clear to expand?
                if (clear) { // all clear
                    i = M - x;
                    while (i) {
                        map.data[x + i][y].space = space;
                        i--;
                    }
                    space.ym = --y;
                } else break;
            }
    };

    expandLeft = function(space) {
        var M = space.yM,
            x = space.xm,
            y = space.ym,
            clear, i;

            while (true) {
                // check expanding edge line
                i = M - y;
                while (i) {
                    if (!map.tileOpen(x, y + i)) {
                        clear = false;
                        break;
                    }
                    i--;
                }

                // are we clear to expand?
                if (clear) { // all clear
                    i = M - y;
                    while (i) {
                        map.data[x][y + i].space = space;
                        i--;
                    }
                    space.xm = --x;
                } else break;
            }
    };

    connect = function(space) {
        var x = space.xM,
            y = space.ym - 1,
            i, node, edges = space.edges;

        // loop through right border of space
        // move from xM, ym - 1 to xM, yM
        i = space.yM - space.ym + 1;
        while (i) {
            node = map.tileOpen(x, y + i).space;
            // verify that the there's an open tile with a space
            // and that it's not already connected to the current space
            if (node && (edges.indexOf(node) === -1)) {
                // connect current space with that one
                edges.push(node);
                node.edges.push(space);
            }
            i--;
        }

        // loop through bottom border of space
        // move from xM - 1, yM to xm -1, yM
        i = space.xM - space.xm;
        x = space.xm - 1;
        while (i) {
            node = map.tileOpen(x + i, y).space;
            // verify that the there's an open tile with a space
            // and that it's not already connected to the current space
            if (node && (edges.indexOf(node) === -1)) {
                // connect current space with that one
                edges.push(node);
                node.edges.push(space);
            }
            i--;
        }
    };

    mapSpace = function(x, y) {
        var space = {
                x: null, y: null, // center coordinates of space
                xM: x, yM: y, // max x and y
                xm: x, ym: y, // min x and y
                edges: []
            },
            expand;

        // try to expand diagonally
        expand = expandDiagonal(space);

        // try to expand up or left
        if (expand.up) expandUp(space);
        else if (expand.left) expandLeft(space);

        // calculate space center x, y tile coords
        space.x = Math.round((x - space.xm) / 2) + space.xm;
        space.y = Math.round((y - space.ym) / 2) + space.ym;

        // connect space to any spaces bordering on the bottom and right
        connect(space);

        navnet.data.push(space);
    };

    navnet.createNavNet = function() {
        console.log("navnet: creating...");

        // cycle through every open map tile
        map.cycleOpen(function(x, y, node) {
            // if the node has no associated space: create one
            if (!node.space) mapSpace(x, y);
        });

        console.log("navnet: nodes: " + this.data.length);
    };

    navnet.Neighbors = function(x, y) { return map[x][y].space.edges; };

    return navnet;
});
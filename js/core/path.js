define(["../map"], function(map) {
    var path = {},
        sortInto,
        isClosed,
        heuristic,
        isJamPoint,
        balanceOf,
        cluster,
        trimCluster;

    cluster = function(unclustered) {
        var clustered = [],
            open = [],
            jam,
            i, j,
            border, index,
            prev, preprev;

        open.push(unclustered.pop());
        do {
            preprev = prev;
            prev = jam;
            jam = open.pop();

            // go through every open border tile
            border = map.open8(jam.x, jam.y);
            i = border.length;
            while (i--) {
                j = border[i].jam;
                // check if current tile is a jam point
                if (j) {
                    // make sure current jam isn't already connected to this new one
                    if (jam.next.indexOf(j) === -1) {
                        j.next.push(jam);
                        jam.next.push(j);
                        open.push(j);
                    }
                }
            }

            // remove the jam from list of unclustered
            i = unclustered.indexOf(jam);
            if (i !== -1) unclustered.splice(i, 1);
            clustered.push(jam);
        } while (open.length);

        return clustered;
    };

    trimCluster = function(cluster) {
        var seperated = [];
        
    };

    balanceOf = function(closed) {
        var balx = 0, baly = 0, i = closed.length;
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

    isJamPoint = function(x, y, closed) {
        var length = closed.length,
            balance;

        if (length > 1 && length < 8) {
            balance = balanceOf(closed);
            if (balance < 0.93) { // we found a jam point
                return {
                          x: x,
                          y: y,
                    balance: balance,
                     closed: length,
                       next: []
                };
            }
        }
    };

    path.createJamNet = function() {
        var test,
            unclustered = [],
            jamClusters = [];

        // check every open tile for jam points
        map.cycleOpen(function(x, y, node) {
            test = isJamPoint(x, y, map.closed8(x, y));
            if (test) {
                unclustered.push(test);
                node.jam = test;
            }
        });

        // seperate jam points into clusters
        while (unclustered.length) jamClusters.push(cluster(unclustered));

        // trim hallways from clusters
        

        this.net = [];

        // connect every cluster to every other one
    };

    heuristic = function(dx, dy) {
        dx = Math.abs(dx);
        dy = Math.abs(dy);
        return (dx > dy) ? dx : dy;
    };

    isClosed = function(node) {
        var i = closed.length;
        while (i--) {
            if ((node.x === closed[i].x) &&
                (node.y === closed[i].y)) {
                return closed[i];
            }
        }
        return false;
    };

    sortInto = function(node, array) {
        var i = array.length;
        if (array[i-1].f < node.f) {
            array.push(node);
            return true;
        }
        while (i--) {
            if (array[i].f < node.f) {
                array.splice(i+1, 0, node);
                return true;
            }
        }
        array.unshift(node);
        return true;
    };

    return path;
});
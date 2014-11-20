define(["./map", "./flags", "../display/console"],
function(map, flags, con) {
    var viewport = {},
        left, top, right, bottom, // in map coords
        width = con.width,
        height = con.height,
        fov;

    /**
     * initialize viewport object
     * @param  {int} px player x-coord (map x-coord)
     * @param  {int} py player y-coord (map y-coord)
     * @param  {String} w player fov
     */
    viewport.init = function(px, py) {
        fov = fov || "full";

        // init viewport location
        left = px - ((width / 2) >> 0);
        right = left + width - 1;
        top = py - ((height / 2) >> 0);
        bottom = top + height - 1;

        // duhhhh
        this.draw();
    };

    /**
     * init Field of View
     * @param {String} type type of field of view to use
     *                      "full" - player can see full viewport, with no FOV calculations
     *                      "los" - player can see line of sight only
     *                      "fow" - player can see line of sight, and map tiles they've visited,
     *                              but not any entities outside of line of sight
     */
    viewport.FOV = function(type) {
        if ((type === "full") ||
            (type === "los") ||
            (type === "fow")) fov = type;
        else console.log("viewport: invalid FOV type: " + type);
    };

    /**
     * update the viewport (called by PC object on move)
     * @param  {number} dx change in player x-coord (+1, 0, or -1)
     * @param  {number} dy change in player y-coord (+1, 0, or -1)
     */
    viewport.update = function(dx, dy) {
        var i;

        if (dx) { // change along x axis
            if (dx > 0) { // move view right if possible
                if (right < map.width - 1) { // view can move right within map bounds
                    right++;
                    i = top;
                    while (i <= bottom) {
                        // clear (left, top)->(left, bottom)
                        map[left][i].F ^= flags.INPCLOS;
                        // add (right+1, top)->(right+1, bottom)
                        map[right][i].F |= flags.INPCLOS; // TODO: works only if fov == 'full'
                        i++;
                    }
                    left++;
                }
            } else { // move view left if possible
                if (left > 0) { // view can move left within map bounds
                    left--;
                    i = top;
                    while (i <= bottom) {
                        // clear (right, top)->(right, bottom)
                        map[right][i].F ^= flags.INPCLOS;
                        // add (left-1, top)->(left-1, bottom)
                        map[left][i].F |= flags.INPCLOS; // TODO: works only if fov == 'full'
                        i++;
                    }
                    right--;
                }
            }
        }

        if (dy) { // change along y axis
            if (dy > 0) { // move view down if possible
                if (bottom < map.height - 1) { // view can move down within map bounds
                    bottom++;
                    i = left;
                    while (i <= right) {
                        // clear (left, top)->(right, top)
                        map[i][top].F ^= flags.INPCLOS;
                        // add (left, bottom+1)->(right, bottom+1)
                        map[i][bottom].F |= flags.INPCLOS; // TODO: works only if fov == 'full'
                        i++;
                    }
                    top++;
                }
            } else { // move view up if possible
                if (top > 0) { // view can move up within map bounds
                    top--;
                    i = left;
                    while (i <= right) {
                        // clear (left, bottom)->(right, bottom)
                        map[i][bottom].F ^= flags.INPCLOS;
                        // add (left, top-1)->(right, top-1)
                        map[i][top].F |= flags.INPCLOS; // TODO: works only if fov == 'full'
                        i++;
                    }
                    bottom--;
                }
            }
        }

        viewport.draw();
    };

    viewport.draw = function() {
        var con_x = width,
            con_y,
            map_x = right,
            map_y,
            tile;

        while (con_x--) {
            map_y = bottom;
            con_y = height;
            while (con_y--) {
                tile = map[map_x][map_y];
                if ((tile.F & flags.INPCLOS) ||
                    ((fov !== 'los') && (tile.F & flags.MAPPED))) {
                    con.swap(con_x, con_y, tile);
                }
                map_y--;
            }
            map_x--;
        }
    };

    return viewport;
});
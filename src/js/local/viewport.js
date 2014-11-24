define(["./map", "./flags", "../display/console"],
function(map, flags, con) {
    var viewport = {},
        left, top, right, bottom, // in map coords
        width,
        height,
        fov;

    /**
     * initialize viewport object
     * @param  {int} px player x-coord (map x-coord)
     * @param  {int} py player y-coord (map y-coord)
     * @param  {String} w player fov
     */
    viewport.init = function(px, py) {
        console.log("viewport: init at " + px + "," + py);
        fov = fov || "full";
        width = con.width;
        height = con.height;

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

    viewport.shadowCast = function() {

        this.spiral(0, 0, ((width > height) ? width : height), function(dx, dy, r) {
            // calc angle of tile
            // if tile open: check angle against shadowlist
            //         else: get shadow angle and add to shadowlist
            return true;
        });

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
                        map.data[left][i].F ^= flags.INPCLOS;
                        // add (right+1, top)->(right+1, bottom)
                        map.data[right][i].F |= flags.INPCLOS; // TODO: works only if fov == 'full'
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
                        map.data[right][i].F ^= flags.INPCLOS;
                        // add (left-1, top)->(left-1, bottom)
                        map.data[left][i].F |= flags.INPCLOS; // TODO: works only if fov == 'full'
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
                        map.data[i][top].F ^= flags.INPCLOS;
                        // add (left, bottom+1)->(right, bottom+1)
                        map.data[i][bottom].F |= flags.INPCLOS; // TODO: works only if fov == 'full'
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
                        map.data[i][bottom].F ^= flags.INPCLOS;
                        // add (left, top-1)->(right, top-1)
                        map.data[i][top].F |= flags.INPCLOS; // TODO: works only if fov == 'full'
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

        console.log("viewport: drawing");

        while (con_x--) {
            map_y = bottom;
            con_y = height;
            while (con_y--) {
                tile = map.data[map_x][map_y];
                if (fov === "full") {
                    con.swap(con_x, con_y, tile);
                } else if ((tile.F & flags.INPCLOS) ||
                    ((fov !== 'los') && (tile.F & flags.MAPPED))) {
                    con.swap(con_x, con_y, tile);
                }
                map_y--;
            }
            map_x--;
        }
    };

    viewport.spiral = function(x, y, diameter, callback) {
        var dx = 0,
            dy = 0,
            sign = 1,
            length = 0,
            i, t;
        while (length++ <= diameter) {
            i = 0; // move right (sign = +1) or left (sign = -1)
            while (i++ < length) {
                t = x + dx + sign;
                if (t > right || t < left) {
                    i = length - i;
                    length++;
                    sign = -sign;
                }
                dx += sign;
                if (!callback(dx, dy, Math.sqrt(dx * dx + dy * dy))) return;
            }
            i = 0; // move down (sign = +1) or up (sign = -1)
            while (i++ < length) {
                t = y + dy + sign;
                if (t > bottom || t < top) {
                    i = length - i;
                    length++;
                    sign = -sign;
                }
                dy += sign;
                if (!callback(dx, dy, Math.sqrt(dx * dx + dy * dy))) return;
            }
            sign = -sign;
        }
    };

    return viewport;
});
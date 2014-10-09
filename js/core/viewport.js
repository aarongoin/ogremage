define(["./console", "./map", "./barry", "./player"], function(con, map, barry, PC) {
    var x0, y0, x1, y1, 
        width, height,
        pX, pY,
        widthShorter,
        mary, fov, fov_type;

    return {
        /**
         * initialize viewport object
         * @param  {int} x top-left corner map x-coord
         * @param  {int} y top-left corner map y-coord
         * @param  {int} w width in tiles
         * @param  {int} h height in tiles
         */
        init: function(x, y, w, h) {
            x0 = x;
            x1 = x + w;
            y0 = y;
            y1 = y + h;
            width = w;
            height = h,
            widthShorter = (w < h),
            mary = map.getMary(x, y, x1, y1);
            fov = barry(width, height);
        },

        /**
         * init Field of View
         * @param {String} type type of field of view to use
         *                      "full" - player can see full viewport, with no FOV calculations
         *                      "los" - player can see line of sight only
         *                      "fow" - player can see line of sight, and map tiles they've visited
         */
        FOV: function(type) {
            if ((type === "full") ||
                (type === "los") ||
                (type === "fow")) fov_type = type;
            else console.log("viewport: invalid FOV type: " + type);
        },

        /**
         * update the viewport and draw
         */
        update: function() {
            // get player position
            var x = PC.pos()[0],
                y = PC.pos()[1],
                a0, a1, b0, b1, m;

            if ((pX !== x) || (pY !== y)) { // player moved
                // get potential new boundaries
                a0 = x - (width / 2) >> 0;
                a1 = x + width - a0;
                b0 = y - (height / 2) >> 0;
                b1 = y + width - b0;

                // adjust if overflowing map boundaries
                m = map.dim();
                if (m[0] < a1) {
                    x1 = m[0];
                    x0 = a0 - (a1 - m[0]);
                } else if (a0 < 0) {
                    x0 = 0;
                    x1 = a1 - (0 - a0);
                } else {
                    x0 = a0;
                    x1 = a1;
                }
                if (m[1] < b1) {
                    y1 = m[1];
                    y0 = b0 - (b1 - m[1]);
                } else if (b0 < 0) {
                    y0 = 0;
                    y1 = b1 - (0 - b0);
                } else {
                    y0 = b0;
                    y1 = b1;
                }
            }

            // get updated map cells
            mary = map.getMary(x0, y0, x1, y1);

            // figure out fov
            if (fov_type !== 'full') {
                
            }

            // draw map and all objects in viewport
        }
    }; 
});
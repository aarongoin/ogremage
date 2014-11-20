define(function() {
    /**
     * create new bit array object
     * @param  {number} w    positive integer
     * @param  {number} h    positive integer
     * @param  {number} d    (optional) positive integer -- makes bit array 2d
     * @return {object}      1d or 2d bit array object (2d only if d defined)
     */
    return function(w, h, d) {
        var i = w, j,
            a = new Array(w);

        if (d !== undefined) { // 2d bit array
            while (i--) {
                a[i] = new Array(h);
                j = h;
                while (j--) a[i][j] = 0;
            }

            /**
             * getter/setter/clearer for bit array
             * @param  {number} x positive integer
             * @param  {number} y positive integer
             * @param  {number} z positive integer
             * @param  {boolean} f (optional) if true: sets bit to true, if false or other defined value: set bit to false. If left undefined, return value of bit
             * @return {boolean}   only returns boolean if f is defined, else return undefined
             */
            return function(x, y, z, f) {
                if (f === undefined) return a[x][y] & z;
                if (f) {
                    a[x][y] |= z;
                    return true;
                } else {
                    a[x][y] ^= z;
                    return false;
                }
            };

        } else { // 1d bit array
            // init all bits to false
            while (i--) a[i] = 0;

            /**
             * getter/setter/clearer for bit array
             * @param  {number} x positive integer
             * @param  {number} y positive integer
             * @param  {boolean} f (optional) if true: sets bit to true, if false or other defined value: set bit to false. If left undefined, return value of bit
             * @return {boolean}   returns bit value
             */
            return function(x, y, f) {
                if (f === undefined) return a[x] & y;
                if (f) {
                    a[x] |= y;
                    return true;
                } else {
                    a[x] ^= y;
                    return false;
                }
            };
        }
    };
});
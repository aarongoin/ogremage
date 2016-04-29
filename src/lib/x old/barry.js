"use strict";
define(function() {
    /**
     * create new bit array object
     * @param  {number} w    positive integer
     * @return {object}      bit array object
     */
    return function(w) {
        var barray, data;

        if (w === undefined) { // 1d bit array
            if (w > 32) {
                data = new Array((w / 32) << 0);
                // have to use more ints
            } else {
                data = 0;
                barray = function(index, flag) {
                    if (flag === undefined) return data & index;
                    if (flag) return data |= ;
                };
            }
        } else if (d === undefined) { // 2d bit array
            // init all bits to false
            while (i--) a[i] = 0;

            /**
             * getter/setter/clearer for bit array
             * @param  {number} x positive integer
             * @param  {number} y positive integer
             * @param  {boolean} f (optional) if true: sets bit to true, if false or other defined value: set bit to false. If left undefined, return value of bit
             * @return {boolean}   returns bit value
             */
            barray = function(x, y, f) {
                if (f === undefined) return a[x] & y;
                if (f) {
                    a[x] |= y;
                    return true;
                } else {
                    a[x] ^= y;
                    return false;
                }
            };
        } else { // 3d bit array
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
            barray = function(x, y, z, f) {
                if (f === undefined) return a[x][y] & z;
                if (f) {
                    a[x][y] |= z;
                    return true;
                } else {
                    a[x][y] ^= z;
                    return false;
                }
            };
        }

        return barray;
    };
});
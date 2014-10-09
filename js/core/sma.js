define(function() {
    /**
     * return simple moving average object for storing and calculating an sma
     * @param  {number} n positive integer -- how many data points to include in the moving average
     * @return {object}   new sma object
     */
    return function(n) {
        var data = [],
            avg = 0,
            len = n,

            /**
             * get simple moving average and/or add new data to range
             * @param  {number} x (optional) if included: x is added to our sma; if left undefined: no new data will be added.
             * @return {number}   current simple moving average
             * 
             */
            sma = function(x) {
                var rem;
                if (x === undefined) return avg;
                x /= len;
                if (data.push(x) > len) { // array.push() returns new array length
                    rem = data.shift();
                    avg -= rem;
                }
                avg += x;
                return avg;
            };

        return sma;
    };
});
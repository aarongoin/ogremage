define(function() {
    /**
     * create mutli-dimensional array
     * @param  {int} x    x dimensions
     * @param  {int} y    y dimensions
     * @param  {function} factory what to init every cell to
     * @return {Array}      returns newly initialized array
     */
    return function(w, h, factory) {
        var x, y, a = [];
        x = -1;
        while (x++ < w) {
            y = -1;
            a.push([]);
            while (y++ < h) {
                a[a.length - 1].push(factory(x, y));
            }
        }
        return a;
    };
});
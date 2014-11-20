define(function() {
    /**
     * create mutli-dimensional array
     * @param  {int} x    x dimensions
     * @param  {int} y    y dimensions
     * @param  {function} factory what to init every cell to
     * @return {Array}      returns newly initialized array
     */
    return function(x, y, factory) {
        var i, a = [];
        while (x--) {
            i = y;
            a.push([]);
            while (i--) {
                a[a.length - 1].push(factory());
            }
        }
        return a;
    };
});
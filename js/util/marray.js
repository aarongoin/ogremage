define(function() {
    /**
     * create mutli-dimesnional array
     * @param  {int} x    x dimensions
     * @param  {int} y    y dimensions
     * @param  {function} factory what to init every cell to
     * @return {Array}      returns newly initialized array
     */
    return function(x, y, factory) {
        var a = [];
        while (x--) {
            a.push([]);
            while (y--) {
                a[a.length].push(factory());
            }
        }
        return a;
    };
});
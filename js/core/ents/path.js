define(["map"], function(map) {
    var jumpPoints, distance, heap;

    heap = function(compare)  {
        var nodes = [];

        compare = compare || function(a, b) { return (a.f <= a.b) ? a : b; };

        // custom simple minimum heap
        heaplet = {
            length: 0,
            pop: function() {
                var small = nodes.shift();
                this.length--;
                return small;
            },
            push: function(node) {
                nodes.push(node);
                while;
            }
        };

        return heaplet;
    };

    jumpPoints = function(direction) {

    };

    distance = function(startx, starty, goalx, goaly) {
        var dx = (goalx > startx) ? goalx - startx : startx - goalx,
            dy = (goaly > starty) ? goaly - starty : starty - goaly;
        return (dx > dy) ? dx : dy;
    };


    return function(goalx, goaly, nodex, nodey) {
        var path = [],
            surrounds,
            prevx, prevy;

        surrounds = map.open8(nodex, nodey);

        return path;
    };
});
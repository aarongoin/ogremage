define(["map"], function(map) {
    var aStar, jumpPoints, distance;

    aStar = function() {

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
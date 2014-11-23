define(["../local/viewport", "../entity/mobile", "../util/override", "./clock"],
function(viewport, base, override, clock) {
    var player = base({title: "Player"});

    /**
     * override base entity moveTo method to handle user t1Tap gesture
     * @param  {Object} gesture  touch gesture passed by handler to this object
     */
    player.moveTo = override(player.moveTo, function(moveTo, gesture) {
        var x = gesture.tileX,
            y = gesture.tileY;
        console.log("player: moveTo " + x + "," + y);
        moveTo(x, y);
        clock.wind( this.distance(this.x, this.y, x, y) );
    }.bind(player));

    /**
     * override base entity move method to update viewport upon completion
     * @param  {int} x x-coord
     * @param  {int} y y-coord
     */
    player.move = override(player.move, function(move, x, y) {
        var dx = x - this.x,
            dy = y - this.y;
        if ( move(x, y) ) viewport.draw();
    }.bind(player));

    player.place = override(player.place, function(place, x, y) {
        console.log("player: placing at " + x + "," + y);
        if ( place(x, y) ) viewport.init(x, y);
        console.log("player: placed at " + this.x + "," + this.y);
    }.bind(player));

    return player;
});
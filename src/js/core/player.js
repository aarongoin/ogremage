define(["../local/viewport", "../entity/mobile", "../util/override"],
function(viewport, base, override) {
    var player = base();

    /**
     * override base entity moveTo method to handle user t1Tap gesture
     * @param  {Object} gesture  touch gesture passed by handler to this object
     */
    player.moveTo = override(player.moveTo, function(moveTo, gesture) {
        console.log("player: moveTo " + gesture.tileX + "," + gesture.tileY);
        moveTo(gesture.tileX, gesture.tileY);
    }.bind(player));

    /**
     * override base entity move method to update viewport upon completion
     * @param  {int} x x-coord
     * @param  {int} y y-coord
     */
    player.move = override(player.move, function(move, x, y) {
        var dx = this.x - x,
            dy = this.y - y;
        if ( move(x, y) ) viewport.update(dx, dy);
    }.bind(player));

    player.place = override(player.place, function(place, x, y) {
        console.log("player: placing at " + x + "," + y);
        if ( place(x, y) ) viewport.init(x, y);
        console.log("player: placed at " + this.x + "," + this.y);
    }.bind(player));

    return player;
});
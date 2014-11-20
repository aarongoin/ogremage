define(["../local/viewport", "../entity/mobile", "../util/override"],
function(viewport, base, override) {
    var player = base();

    /**
     * override base entity moveTo method to handle user t1Tap gesture
     * @param  {Object} gesture  touch gesture passed by handler to this object
     */
    player.moveTo = override(player.moveTo, function(moveTo, gesture){
        moveTo(gesture.tileX, gesture.tileY);
    });

    /**
     * override base entity move method to update viewport upon completion
     * @param  {int} x x-coord
     * @param  {int} y y-coord
     */
    player.move = override(player.move, function(move, x, y){
        var dx = this.x - x,
            dy = this.y - y;
        if ( move(x, y) ) viewport.update(dx, dy);
    });

    return player;
});
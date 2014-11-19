define(["../entity/mobile", "../util/override"], function(base, override) {
    var player = base();

    /**
     * override base entity moveTo method to handle user t1Tap gesture
     * @param  {Object} gesture  touch gesture passed by handler to this object
     */
    player.moveTo = override(player.moveTo, function(moveTo, gesture){
        // decipher location from gesture
        moveTo(gesture.tileX, gesture.tileY);
    });

    return player;
});
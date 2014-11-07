define(["player", "items", "mobs", "objects", "scene", "map", "hud"],
function(player, items, mobs, objects, scene, map, hud) {
    var local = {};

    local.update = function(time) {
        var i, spark;

        spark = (time.slow) ? 1/60 : 1;
        player.spark(spark);
        i = mobs.length;
        while (i--) {
            mobs[i].spark(spark);
        }
    };

    return local;
});
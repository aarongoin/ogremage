define(["../entity/player", "../local/items", "../local/mobs", "../local/objects", "../local/scene", "../local/map", "../local/hud"],
function(player, items, mobs, objects, scene, map, hud) {
    var local = {};

    local.update = function(energy) {
        var i;

        player.spark(energy);
        i = mobs.length;
        while (i--) {
            mobs[i].spark(spark);
        }
    };

    return local;
});
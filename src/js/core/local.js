define(["./player", "../local/map", "../local/navnet"],
function(player, map, navnet) {
    var local = {};

    local.init = function(init) {
        console.log("local: init");
        // initialize map
        map.init(init.map);

        // create navnet
        navnet.createNavNet();

        // place player into map
        player.place(((map.width / 2) >> 0), ((map.height / 2) >> 0));
        player.init(init.player);
        player.state = player.states["active"];
    };

    local.update = function(energy) {
        var i;

        player.update(energy);
        /*
        i = mobs.length;
        while (i--) {
            mobs[i].spark(spark);
        }
        */
    };

    return local;
});
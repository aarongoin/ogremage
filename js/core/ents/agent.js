define(["pack"], function(pack) {
    var constructor, prototype;

    constructor = function(proto,init) {
        init = init || {};

        proto.isAgent = true;
        proto.updates.push(prototype.update);
    };

    prototype = {
        /**
         * update!
         * @param  {array} array of bordering tiles
         */
        update: function(borders) {
            // TODO - agent updating!

        }
    };

    return function(init) {
        if (init.isPack) return constructor(init);
        return constructor(pack(init), init);
    };
});
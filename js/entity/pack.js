define(["./primal"], function(primal) {
    var constructor, prototype;

    constructor = function(proto, init) {
        init = init || {};

        proto.isPack = true;
        proto.updates.push(prototype.update);
    };

    prototype = {
        /**
         * update!
         * @param  {array} array of bordering tiles
         */
        update: function(borders) {
            // TODO - pack updating!

        }
    };

    return function(init) {
        if (init.isPrimal) return constructor(init);
        return constructor(primal(init), init);
    };
});
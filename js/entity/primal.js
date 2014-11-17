define(["./mobile"], function(mobile) {
    var constructor, prototype;

    constructor = function(proto, init) {
        init = init || {};

        proto.isPrimal = true;
        proto.updates.push(prototype.update);
    };

    prototype = {
        /**
         * update!
         * @param  {array} array of bordering tiles
         */
        update: function(borders) {
            // TODO - primal updating!

        }
    };

    return function(init) {
        if (init.isMobile) return constructor(init);
        return constructor(mobile(init), init);
    };
});
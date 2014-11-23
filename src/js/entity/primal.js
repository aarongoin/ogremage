define(["./mobile"], function(mobile) {
    var constructor, prototype;

    constructor = function(proto, init) {
        init = init || {};

        proto.isPrimal = true;

        // set up senses (how far entity can see/hear/etc as well as flags for those things)
        proto.senses = init.senses || {
            see: 7,
            smell: 2,
            hear: 5
        };

        proto.emotions = init.emotions || {
            fear: 0,
            anger: 0,
            happiness: 0,
            sadness: 0,
            threshold: 10
        };

        proto.attack = prototype.attack.bind(proto);


        proto.updates.push(prototype.update.bind(proto));

        return proto;
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
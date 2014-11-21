define(["./random"], function(rand) {
    console.log("colorwheel: init module");
    var colors = [
        /* grayscale dark  */
        '#000000', // 0 - black
        '#333333', // 1
        '#666666', // 2
        /* grayscale light */
        '#999999', // 3
        '#cccccc', // 4
        '#ffffff', // 5
        /* red/orange      */
        '#b21f35', // 6
        '#d82735', // 7
        '#ff7435', // 8
        /* orange/yellow   */
        '#ffa135', // 9
        '#ffcb35', // 10
        '#fff735', // 11
        /* green           */
        '#00753a', // 12
        '#009e47', // 13
        '#16dd36', // 14
        /* blue            */
        '#0052a5', // 15
        '#0079e7', // 16
        '#06a9fc', // 17
        /* purple          */
        '#681e7e', // 18
        '#7d3cb5', // 19
        '#bd7af6'  // 20
    ];

    return {
        /**
         * return random color
         * @return {[type]} [description]
         */
        random: function() {
            return colors[rand.simple(0, colors.length)];
        },

        randi: function() {
            return rand.simple(0, 20);
        },

        gray: function(dark) {
            return rand.simple(0, 3);
        },

        color: function() {
            return rand.simple(6, colors.length);
        },

        any: function() {
            var c = rand.simples(0, 255, 3);
            return "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
        },

        /**
         * get color at index
         * @param  {int} index index of color
         * @return {string}       hex color code
         */
        at: function(index) { return colors[index]; },

        is: function(color) { return colors.indexOf(color); }
    };
});
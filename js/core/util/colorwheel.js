define(["./random"], function(rand) {
    console.log("prep: colorwheel");
    var colors = [  '#000000', '#333333', '#666666',  /* grayscale dark  */
                    '#999999', '#cccccc', '#ffffff',  /* grayscale light */
                    '#b21f35', '#d82735', '#ff7435',  /* red/orange      */
                    '#ffa135', '#ffcb35', '#fff735',  /* orange/yellow   */
                    '#00753a', '#009e47', '#16dd36',  /* green           */
                    '#0052a5', '#0079e7', '#06a9fc',  /* blue            */
                    '#681e7e', '#7d3cb5', '#bd7af6']; /* purple          */

    return {
        /**
         * return random color
         * @return {[type]} [description]
         */
        random: function() {
            return colors[rand.lfsr(0, colors.length)];
        },

        randi: function() {
            return rand.lfsr(0, colors.length);
        },

        gray: function(dark) {
            return rand.lfsr(0, 3);
        },

        color: function() {
            return rand.lfsr(6, colors.length);
        },

        any: function() {
            var c = rand.simples(0, 255, 3);
            return "rgb(" + c[0] + ", " + c[1] + " , " + c[2] + ")";
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
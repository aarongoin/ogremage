define(function(){
    console.log("prep: canvas");
    var c = {},
        canvas = document.getElementById('canvas'),
        context = canvas.getContext("2d"),
        ratio;

    // init canvas
    canvas.width = /*320 ||  */ window.innerWidth;
    canvas.height = /*568 || */ window.innerHeight;
    ratio = canvas.width / canvas.height;
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    console.log("      width: " + canvas.width);
    console.log("      height: " + canvas.height);
    console.log("      ratio: " + ratio);

    window.addEventListener("resize", function(event) {
        c.resize();
    });

    c = {
        /**
         * get canvas context
         * @return {object} canvas context
         */
        ctx: function(){ return context; },

        /**
         * get canvas dimensions
         * @return {Array} array with width, height, and ratio data
         */
        dim: function(){ return [canvas.width, canvas.height, ratio]; },

        /**
         * overload to get resize event
         */
        resize: function() {},

        /**
         * get canvas element
         * @return {element} canvas with id="canvas"
         */
        elem: function(){ return canvas; }
    };
    return c;
});

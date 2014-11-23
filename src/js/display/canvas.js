define(function(){
    console.log("canvas: init module");
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

    console.log("canvas: width: " + canvas.width);
    console.log("canvas: height: " + canvas.height);
    console.log("canvas: ratio: " + ratio);

    window.addEventListener("resize", function(event) {
        c.resize();
    });

    c = {
        width: canvas.width,
        height: canvas.height,
        ratio: ratio,
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
        elem: function(){ return canvas; },

        //drawLine(x0, y0, x1, y1)
    };
    return c;
});

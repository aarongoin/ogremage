console.log("exec: globals.js");
var app = (function(app) {
    app.globals = {
        COLORS: ['#b21f35', '#d82735', '#ff7435',  /* red/orange    */
                 '#ffa135', '#ffcb35', '#fff735',  /* yellow/orange */
                 '#00753a', '#009e47', '#16dd36',  /* green         */
                 '#0052a5', '#0079e7', '#06a9fc',  /* blue          */
                 '#681e7e', '#7d3cb5', '#bd7af6']  /* purple        */
    };
    return app;
}(app || {}));
define(["../display/console", "../display/input"],
function(con, input) {
	var display = {};

	display.init = function(sprites, pixel, mouse, callback) {
		con.init(sprites, pixel, function() {
            input.init(mouse);
            this.run(true);
			callback();
        });
	};

	return display;
});
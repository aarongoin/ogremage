define(["../display/console", "../display/input"],
function(con, input) {
	var display = {width: function() { return con.width; }, height: function() { return con.height; } };

	display.init = function(sprites, pixel, mouse, callback) {
		con.init(sprites, pixel, function() {
            input.init(mouse);
            this.run(true);
			callback();
        });
	};

	return display;
});
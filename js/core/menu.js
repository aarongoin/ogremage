define(["../display/console"], function(con) {
	var menu = {},
		list,
		current,
		down,
		toggle,
		touching,
		draw;

	toggle = function(button) {
		button.isDown = !button.isDown;
		draw(button);
	};

	touching = function(x, y) {

	};

	draw = function(button) {

	};

	menu.show = function(title) {
		current = list[title];
		if (!current) {
			console.log("Error: " + title + "is an invalid menu");
			return;
		}

	};

	menu.create = function(menu) {
		var i, buttons, b;

		buttons = menu.buttons;
		i = buttons.length;
		while (i--) {
			b = buttons[i];

			b.isDown = false;

			b.up = b.up || {f: 5, b: 2};
			b.down = b.down || {f: 2, b: 5};

			
		}
		// flesh out button objects
		// position buttons

		list[menu.title] = menu;
	};

	menu.event = function(type, x, y) {
		var button = touching(x, y);

		if ((type === "down") || button) {
			down = button;
			toggle(button);
		} else if (type === "move") {
			if (button) {
				if (button !== down) {
					toggle(down);
					down = button;
					toggle(button);
				}
			} else if (down) toggle(down);
		} else if ((type === "up") && button) {
			toggle(button);
			button.click();
		}
	};

	return menu;
});
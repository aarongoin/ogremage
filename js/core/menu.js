define(["../display/console", "../display/alphanum", "./handler"], function(con, alphanum, handle) {
	var menu = {},
		dict,
		current,
		down,
		toggle,
		touching,
		draw,
		buttonTiles,
		prototype = {
			title: "Button",
			up: {f: 5, b: 2},
			down: {f: 2, b: 5},
			margins: {left: 1, right: 1},
			click: function() { console.log("Button: " + this.title + " clicked."); }
		},
		tile = function(X, Y, C, F, B) { return {x: X, y: Y, c: C, f: F, b: B}; };

	toggle = function(button) {
		button.isDown = !button.isDown;
		draw(button);
	};

	touching = function(x, y) {
		var buttons = current.buttons,
			i = buttons.length,
			b;
		while (i--) {
			b = buttons[i];
			if ((x <= b.x1) && (y <= b.y1) &&
				(x >= b.x0) && (y >= b.y0)) return b;
		}

		return false;
	};

	draw = function(button) { con.draw( (button.isDown) ? button.tiles.down : button.tiles.up ); };

	buttonTiles = function(x, y, title, colors, margins) {
		var spriteChars = alphanum.spritesFromString(title),
			i, m, tiles;

		// create left margin tiles
		i = margins.left;
		while (i) {
			spriteChars.unshift(0);
			i--;
		}
		// create right margin tiles
		i = margins.right;
		while (i) {
			spriteChars.push(0);
			i--;
		}

		i = spriteChars.length;
		while (i--) {
			// create top margin tiles
			m = margins.top;
			while (m) {
				tiles.push( tile(x + i, y - m, spriteChars[i], colors.f, colors.b) );
				m--;
			}

			// create center tile
			tiles.push( tile(x + i, y, spriteChars[i], colors.f, colors.b) );

			// create bottom margin tiles
			m = margins.bottom;
			while (m) {
				tiles.push( tile(x + i, y + m, spriteChars[i], colors.f, colors.b) );
				m--;
			}
		}

		return t;
	};

	menu.show = function(title) {
		var i;
		current = dict[title];
		if (!current) {
			console.log("Error: " + title + " is an invalid menu");
			return;
		}

		handle.stop(this.event);

		con.clear("rgba(0, 0, 0, 1");
		i = current.buttons.length;
		while (i--) draw(current.buttons[i]);

	};

	menu.hide = function() {
		handle.start();
		con.clear("rgba(0, 0, 0, 1");
	};

	menu.create = function(menu) {
		var buttons = menu.buttons,
			l = buttons.length,
			i = 0, b,
			cX = Math.round(con.width / 2),
			cY = Math.round(con.height / l);


		while (i < l) {
			b = buttons[i];

			// button function properties
			b.title = b.title || prototype.title;
			b.isDown = false;
			b.click = b.click || prototype.click;

			// button display properties
			b.up = b.up || prototype.up;
			b.down = b.down || prototype.down;
			b.margins = b.margins || prototype.margins;

			b.x0 = cX - (b.w / 2) >> 0;
			b.y0 = (cY * i) - (cY / 2) >> 0;

			// create button console representation
			b.tiles.up = b.tiles.up || buttonTiles(b.x0, b.y0, b.title, b.up, b.margins);
			b.tiles.down = b.tiles.down || buttonTiles(b.x0, b.y0, b.title, b.down, b.margins);

			// determine button placement on the screen
			b.h = b.margins.top + b.margins.bottom + 1;
			b.w = b.tiles.up.length;
			b.x1 = b.x0 + b.w;
			b.y1 = b.y0 + b.h;

			i++;
		}

		// add menu to dictionary of menus
		dict[menu.title] = menu;
		dict.count = ++dict.count || 1;

	};

	menu.event = function(type, x, y) {
		var button = touching(x, y);

		if ((type === "down") && button) {
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
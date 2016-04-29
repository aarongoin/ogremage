var FS = require('fs'),
	jsmin = require('./jsmin').jsmin,
	world = 'module.exports={',
	races = FS.readdirSync('./src/bp/races'),
	areas = FS.readdirSync('./src/bp/areas'),
	bp,
	i;

// pack up console
bp = FS.readFileSync('./src/bp/console.bp', 'utf8');
bp = jsmin(bp, 3);
world += 'console:' + bp + ',';

// pack up player
bp = FS.readFileSync('./src/bp/player.bp', 'utf8');
bp = jsmin(bp, 3);
world += 'player:' + bp + ',';

// get starting area
bp = FS.readFileSync('./src/bp/areas/start.bp', 'utf8');
bp = jsmin(bp, 3);
world += 'start:' + bp + ',';

// pack races up
world += 'races:{';
i = races.length;
while (i--) {
	bp = FS.readFileSync('./src/bp/races/' + races[i], 'utf8');

	if (races[i][0] !== '.') {
		bp = jsmin(bp, 3);

		world += races[i].split('.')[0] + ':' + bp;
		if (i !== 0) world += ',';
	}
}
world += '},';

// pack areas up
world += 'areas:{';
i = areas.length;
while (i--) {
	bp = FS.readFileSync('./src/bp/areas/' + areas[i], 'utf8');

	if (areas[i][0] !== '.' && areas[i] !== 'start.bp') {
		bp = jsmin(bp, 3);

		world += areas[i].split('.')[0] + ':' + bp;
		if (i !== 0) world += ',';
	}
}
world += '}};';

FS.writeFileSync('./src/bp/world.js', world);
define(["core/input", "core/console"], function(input, con) {
    var pc = {},
        self = {x: 0, y: 0, c: 0, f:5};

    input.other(function(type, finger) {
        var dim, x, y;
        if (type === 'tap') {
            dim = con.dim();
            // get touch coordinates in console tiles
            x = (finger.x / dim[2]) >> 0;
            y = (finger.y / dim[2]) >> 0;
        }
    });

    pc.init = function(x, y, c) {
        self.x = x;
        self.y = y;
        self.c = c;
    };

    pc.pos = function() { return [self.x, self.y]; };

    pc.draw = function() {
        var i = {};
        i.x = self.x;
        i.y = self.y;
        i.c = self.c;
        i.f = self.f;
        return i;
    };
    return pc;
});
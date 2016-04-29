var convert = require('./base62');

module.exports = {
	pack: function(uncompressed) {
		var out = '',
			flag = 0,
			bit = 0,
			row,
			i;

		out += uncompressed[0].length;

		while (row = uncompressed.shift()) {
			i = -1;
			while (++i < row.length) {
				if (row[i] === '#') flag |= Math.pow(2, bit);
                
				if (++bit === 31) {
					out += ' ' + convert.toB62(flag);
					bit = 0;
					flag = 0;
				}
			}
		}
    
		if (bit !== 0) out += ' ' + flag;

		return out;
	},
	unpackLive: function(compressed, callback) {
		var arr = compressed.split(' '),
			width,
			height,
			flag,
			bit,
			x = 0,
			y = 0;

        
		width = parseInt( arr.shift(), 10 );
		height = parseInt( arr.shift(), 10 );
        
		while (arr.length) {
			flag = convert.toB10(arr.shift());

			bit = -1;
			while (++bit < 31) {

				callback( x, y, (flag & Math.pow(2, bit)) ? true : false );

				if (++y === height) {
					if (++x === width) break;
					else y = 0;
				}
			}
		}
	},
	unpack: function(compressed) {
		var out = [],
			row = '',
			arr = compressed.split(' '),
			len,
			flag,
			bit;
        
        len = parseInt( arr.shift(), 10 );
        
		while (arr.length) {
			flag = convert.tob10(arr.shift());
			bit = -1;
			while (++bit < 31) {
				row += (flag & Math.pow(2, bit)) ? '#' : '_';

				if (row.length === len) {
					out.push(row);
					row = '';
                    
                    if ((arr.length === 0) && (30 - bit < len)) break;
				}
			}
		}

		return out;
	}
};
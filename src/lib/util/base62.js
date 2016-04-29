var table = {
		decFromB62: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15, g: 16, h: 17, i: 18, j: 19, k: 20, l: 21, m: 22, n: 23, o: 24, p: 25, q: 26, r: 27, s: 28, t: 29, u: 30, v: 31, w: 32, x: 33, y: 34, z: 35, A: 36, B: 37, C: 38, D: 39, E: 40, F: 41, G: 42, H: 43, I: 44, J: 45, K: 46, L: 47, M: 48, N: 49, O: 50, P: 51, Q: 52, R: 53, S: 54, T: 55, U: 56, V: 57, W: 58, X: 59, Y: 60, Z: 61 },
		b62FromDec: { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: 'a', 11: 'b', 12: 'c', 13: 'd', 14: 'e', 15: 'f', 16: 'g', 17: 'h', 18: 'i', 19: 'j', 20: 'k', 21: 'l', 22: 'm', 23: 'n', 24: 'o', 25: 'p', 26: 'q', 27: 'r', 28: 's', 29: 't', 30: 'u', 31: 'v', 32: 'w', 33: 'x', 34: 'y', 35: 'z', 36: 'A', 37: 'B', 38: 'C', 39: 'D', 40: 'E', 41: 'F', 42: 'G', 43: 'H', 44: 'I', 45: 'J', 46: 'K', 47: 'L', 48: 'M', 49: 'N', 50: 'O', 51: 'P', 52: 'Q', 53: 'R', 54: 'S', 55: 'T', 56: 'U', 57: 'V', 58: 'W', 59: 'X', 60: 'Y', 61: 'Z' }
	}, 
	toB62 = function(decimal) {
		var bits,
			num;

		if (decimal === 0) return '0';
		else {
			bits = [];
			num = '';
		}

		while (decimal > 0) {
			bits.push(decimal % 62);
			decimal = (decimal / 62) >> 0;
		}

		while (bits.length) num += table.b62FromDec[bits.pop()];

		return num;
	},
	toB10 = function(base62) {
		var num = 0,
			i = -1;

		while (++i < base62.length) {
			num += ( table.decFromB62[ base62[i] ] * Math.pow(62, base62.length - i - 1) );
		}

		return num;
	};

module.exports = { toB62: toB62, toB10: toB10 };
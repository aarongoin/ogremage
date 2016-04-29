module.exports = function(value) {
	if (value.length) return Math.random() * (value[1] - value[0] + 1) + value[0];
	else return value;
};
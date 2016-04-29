var _i;

var PriorityQ = function() {
	this.data = [];
};
PriorityQ.prototype.add = function(object, priority) {
	var _i = this.data.length;
	if (_i) {
		while (_i--) {
			if (this.data[_i][1] >= priority) {
				this.data.splice(_i + 1, 0, [object, priority]);
				break;
			} else if (_i === 0) {
				this.data.unshift([object, priority]);
				break;
			}
		}
	} else this.data.push([object, priority]);
};
PriorityQ.prototype.remove = function() {
	return this.data.pop()[0];
};
PriorityQ.prototype.removeFromQ = function(object) {
	_i = this.data.length;
	while (_i--) if (this.data[_i][0] === object) break;
	return this.data.splice(_i, 1)[0];
};

module.exports = PriorityQ;
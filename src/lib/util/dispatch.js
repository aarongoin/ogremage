var events = {},
	list,
	i;

var Dispatch = function(event) {
	if (events[event.type]) {
		list = events[event.type];
		i = list.length;
		while (i--) (list[i])(event);
	}
};

Dispatch.on = function(event, callback) {
	if (!events[event]) events[event] = [];
	if (events[event].indexOf(callback) === -1) events[event].push(callback);
};
Dispatch.remove = function(event, callback) {
	events[event].splice(events[event].indexOf(callback), 1);
};

module.exports = Dispatch;
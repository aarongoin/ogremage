var events = {},
	list,
	i;

var Dispatch = function(type, event) {
	if (events[type]) {
		list = events[type];
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

var Dispatcher = function() {
	var self = {
		events: {},
		list: null,
		i: null
	};
	this.on = _on.bind(self);
	this.remove = _remove.bind(self);
};

function _on(event, callback) {
	// does event not yet exist?
	if (!this.events[event]) {
		// create it
		this.events[event] = [callback];
		// and set it's callback
		this[event] = callback;
	// event already exists, but are we already tracking the callback?
	} else if (this.events[event].indexOf(callback) === -1) {
		// add this new callback
		this.events[event].push(callback);
		// and set callback as function to iterate over list on event
		this[event] = _callbacks.bind(this, event);
	}
	
};
function _remove(event, callback) {
	events[event].splice(events[event].indexOf(callback), 1);
};
function _callbacks(type, event) {
	var i;
	this.list = events[type];
	i = this.list.length;
	while (i--) (this.list[i])(event);
}

module.exports = {Dispatcher: Dispatcher, Central: Dispatch};


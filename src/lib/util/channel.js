var Channel = function(worker) {
	this._worker = worker;
	this._on = { terminate: this._terminate };
	this._i = null;

	this._onMessage = this._onMessage.bind(this);
	worker.addEventListener('message', this._onMessage);
};

Channel.prototype.terminate = function() {

	this._worker.removeEventListener('message', this._onMessage);

	this._worker.postMessage({ id: 'terminate' });
};

Channel.prototype.to = function(name) {

	this[name] = function(data) {
		if (!data) this._worker.postMessage({ id: name });
		else if (data.transfer) this._worker.postMessage({ copy: data.copy, id: name, transfer: data.transfer }, [data.transfer]);
		else this._worker.postMessage({ copy: data.copy, id: name });
	};

	return this[name];
};

Channel.prototype.from = function(name, callback){
	this._on[name] = callback;
};

Channel.prototype.toFrom = function(name, callback) {
	this.from(name, callback);
	return this.to(name);
};

Channel.prototype._onMessage = function(event) {

	if (event.data.id) {

		this._i = this._on[event.data.id];
		if (this._i) this._i(event.data.copy, event.data.transfer);

		this._i = null;
	}
};

Channel.prototype._terminate = function() {
	this._worker.removeEventListener('message', this._onMessage);
};

module.exports = Channel;
define(function() {
    var W = {};
    W.add = function(name, value) { if (!W[name]) W[name] = value; };
    return W;
});
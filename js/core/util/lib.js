define(function(){
    return {
        saveObj: function(key, object) {
            localstorage.setItem(key, JSON.stringify(object));
        },

        loadObj: function(key) {
            return JSON.parse(localstorage.getItem(key));
        }
    };
});
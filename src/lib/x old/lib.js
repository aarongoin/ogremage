"use strict";
define(function() {
    return {
        saveObj: function(key, object) {
            localStorage.setItem(key, JSON.stringify(object));
        },

        loadObj: function(key) {
            return JSON.parse(localStorage.getItem(key));
        }
    };
});
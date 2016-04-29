"use strict";
define(function(){
    console.log("random: init module");
    var last,
        max = Math.pow(2, 16),
        out, seed;

    out = seed = Math.round(Math.random() * max);

    var lfsr = function() {
        var bit;
        bit = ((out >> 0) ^ (out >> 2) ^ (out >> 3) ^ (out >> 5)) & 1;
        out = (out >> 1) | (bit << 15);
        return out / max;
    };

    return {
        gaussian: function(mean, std_dev) {
            var p = Math.random();
            var n = (Math.random() * std_dev + mean) >> 0;
            if(p > 0.5){ // above the mean
                if(p < 0.8413){
                } else if(p < 0.9772){ std_dev *= 2;
                } else if(p < 0.9986){ std_dev *= 3;
                } else { std_dev *= 4;
                }
            } else { // below the mean
                if(p > 0.1587){ std_dev *= -1;
                } else if(p > 0.0228){ std_dev *= -2;
                } else if(p > 0.0014){ std_dev *= -3;
                } else { std_dev *= -4;
                }
            }
            return n + std_dev;
        },

        simple: function(low, high) {
            return (Math.random() * (high - low) + low) >> 0;
        },

        lfsr: function(low, high) {
            return (lfsr() * high + low) >> 0;
        },

        simples: function(low, high, qty) {
            var a = [];
            while(qty--){
                a.push((Math.random() * high + low) >> 0);
            }
            return a;
        },

        unique: function(low, high) {
            var cur = (Math.random() * high + low) >> 0;
            while (last === cur) cur = (Math.random() * high + low) >> 0;
            last = cur;
            return cur;
        }
    };
});
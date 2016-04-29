"use strict";
define(function() {
    var uuid,
        table = [],
        i = 0;

    while (i < 256) {
        table[i] = ((i < 16 ) ? '0' : '') + (i).toString(16);
        i++;
    }

    uuid = function() {
        var a = Math.random() * 0xffffffff | 0,
            b = Math.random() * 0xffffffff | 0,
            c = Math.random() * 0xffffffff | 0,
            d = Math.random() * 0xffffffff | 0;
        return table[a & 0xff] + table[a >> 8 & 0xff] + table[a >> 16 & 0xff] + table[a >> 24 & 0xff] +
            '-' + table[b & 0xff] + table[b >> 8 & 0xff] +
            '-' + table[b >> 16 & 0x0f | 0x40] + table[b >> 24 & 0xff] +
            '-' + table[c & 0x3f | 0x80] + table[c >> 8 & 0xff] +
            '-' + table[c >> 16 & 0xff] + table[c >> 24 & 0xff] + table[d & 0xff] + table[d >> 8 & 0xff] + table[d >> 16 & 0xff] + table[d >> 24 & 0xff];
    };

    return uuid;
});
'use strict';

module.exports = {
    string: function(a, b){

        a += ''
        b += ''

        return a.localeCompare(b)
    },

    number: function(a, b) {
        return a - b
    }
}
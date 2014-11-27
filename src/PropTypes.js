'use strict';

function val(fn){

    return function(props, propName){

        return fn(props[propName], props, propName)
    }
}

module.exports = {
    numeric: val(function(value){
        if (value * 1 != value){
            return new Error('Invalid rowHeight value')
        }
    }),

    sortInfo: val(function(value){
        if (typeof value == 'string' || typeof value == 'number'){
            return new Error('Invalid sortInfo specified')
        }
    })
}
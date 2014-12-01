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
    }),

    column: val(function(value, props, propName){

        if (!value){
            return new Error('No columns specified. Please specify at least one column!')
        }

        if (!Array.isArray(value)){
            value = props[propName] = [value]
        }

        var err

        value.some(function(col, index){
            if (!col.name){
                err = new Error('All grid columns must have a name! Column at index ' + index + ' has no name!')
                return true
            }
        })

        return err

    })
}
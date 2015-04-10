'use strict';

var curry = require('./curry')
var TYPES = require('./types')

function isFn(fn){
    return typeof fn === 'function'
}

var sorty = curry(function(sortInfo, array){
    return array.sort(getMultiSortFunction(sortInfo))
})

sorty.types = TYPES

var getSingleSortFunction = function(info){

    if (!info){
        return
    }

    var field = info.name
    var dir   = info.dir === 'desc' || info.dir < 0?
                    -1:
                    info.dir === 'asc' || info.dir > 0?
                        1:
                        0

    if (!dir){
        return
    }

    if (!info.fn && info.type){
        info.fn = sorty.types[info.type]
    }

    if (!info.fn){
        info.fn = sorty.types.string || TYPES.string
    }

    var fn = info.fn

    return function(first, second){
        var a = first[field]
        var b = second[field]

        return dir * fn(a, b)
    }
}

var getSortFunctions = function(sortInfo){
    if (!Array.isArray(sortInfo)){
        sortInfo = [sortInfo]
    }

    return sortInfo.map(getSingleSortFunction).filter(isFn)
}

var getMultiSortFunction = function(sortInfo){

    var fns = getSortFunctions(sortInfo)

    return function(first, second){
        var result = 0
        var i      = 0
        var len    = fns.length
        var fn

        for (; i < len; i++){
            fn = fns[i]
            if (!fn){
                continue
            }

            result = fn(first, second)

            if (result != 0){
                return result
            }
        }

        return result
    }
}

sorty._getSortFunctions = getSortFunctions
sorty.getFunction = getMultiSortFunction

module.exports = sorty
'use strict';

var Row        = require('../Row')
var RowFactory = React.createFactory(Row)

module.exports = function renderRow(props, data, index, fn){
    var factory  = props.rowFactory || RowFactory
    var key      = data[props.idProperty]

    var config ={
        className: index % 2 === 0? 'z-even': 'z-odd',
        // key      : index,
        key      : key,
        data     : data,
        index    : index,

        renderCell : props.renderCell,
        renderText : props.renderText,
        cellPadding: props.cellPadding,
        rowHeight  : props.rowHeight,
        columns    : props.columns
    }

    if (typeof fn == 'function'){
        config = fn(config)
    }

    return factory(config)
}
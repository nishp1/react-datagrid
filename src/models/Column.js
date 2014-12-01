'use strict';

var humanize = require('ustring').humanize
var assign   = require('object-assign')

var Column = function(col, props){

    col = assign({}, Column.defaults, col)

    //title
    if (!col.title){
        col.title = humanize(col.name)
    }

    //sortable
    if (props && !props.sortable){
        col.sortable = false
    }
    col.sortable = !!col.sortable

    //resizable
    if (props && props.resizableColumns === false){
        col.resizable = false
    }
    col.resizable = !!col.resizable

    //filterable
    if (props && props.filterableColumns === false){
        col.filterable = false
    }
    col.filterable = !!col.filterable

    //hidden
    col.hidden = !!col.hidden

    //visible
    col.visible  = !col.hidden

    //flexible
    col.flexible = !col.width

    return col
}

Column.displayName = 'Column'

Column.defaults = {
    sortable  : true,
    filterable: true,
    resizable : true,
    type      : 'string'
}

module.exports = Column
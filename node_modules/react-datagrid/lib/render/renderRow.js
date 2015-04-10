'use strict';

var assign = require('object-assign')
var React  = require('react')

var Row        = require('../Row')
var RowFactory = React.createFactory(Row)

/**
 * Render a datagrid row
 *
 * @param  {Object}   props The props from which to build row props
 * @param  {Object}   data The data object that backs this row
 * @param  {Number}   index The index in the grid of the row to be rendered
 * @param  {Function} [fn] A function that can be used to modify built row props
 *
 * If props.rowFactory is specified, it will be used to build the ReactElement
 * corresponding to this row. In case it returns undefined, the default RowFactory will be used
 * (this case occurs when the rowFactory was specified just to modify the row props)
 *
 * @return {ReactElement}
 */
module.exports = function renderRow(props, data, index, fn){
    var factory  = props.rowFactory || RowFactory
    var key      = data[props.idProperty]

    var selected = false

    if (typeof props.selected == 'object' && props.selected){
        selected = !!props.selected[key]
    } else if (props.selected){
        selected = key === props.selected
    }

    var config = {
        className: index % 2 === 0? 'z-even': 'z-odd',
        selected : selected,

        key      : key,
        data     : data,
        index    : index,

        cellFactory: props.cellFactory,
        renderCell : props.renderCell,
        renderText : props.renderText,
        cellPadding: props.cellPadding,
        rowHeight  : props.rowHeight,
        columns    : props.columns,

        rowContextMenu: props.rowContextMenu,
        showMenu: props.showMenu,

        _onClick: props.onRowClick
    }

    var style
    var rowStyle = props.rowStyle

    if (rowStyle){
        style = {}

        if (typeof rowStyle == 'function'){
            style = rowStyle(data, config)
        } else {
            assign(style, rowStyle)
        }

        config.style = style
    }

    var className = props.rowClassName

    if (typeof className == 'function'){
        className = className(data, config)
    }

    if (className){
        config.className = className
    }

    if (typeof fn == 'function'){
        config = fn(config)
    }

    var row = factory(config)

    if (row === undefined){
        row = RowFactory(config)
    }

    if (config.selected && this){
        this.selIndex = index
    }

    return row
}
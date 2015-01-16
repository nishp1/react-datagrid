'use strict';

var React       = require('react')
var assign      = require('object-assign')
var Cell        = require('../Cell')
var CellFactory = React.createFactory(Cell)

module.exports = React.createClass({

    displayName: 'ReactDataGrid.Row',

    propTypes: {
        data   : React.PropTypes.object,
        columns: React.PropTypes.array,
        index  : React.PropTypes.number
    },

    getDefaultProps: function(){

        return {
            defaultClassName: 'z-row',
            mouseOverCls    : 'z-over',
            defaultStyle    : {}
        }
    },

    getInitialState: function(){
        return {
            mouseOver: false
        }
    },

    render: function() {
        var props = this.prepareProps(this.props)
        var cells = props.children || props.columns
                                        .map(this.renderCell.bind(this, this.props))

        return React.createElement("div", React.__spread({},  props), cells)
    },

    prepareProps: function(thisProps){
        var props = assign({}, thisProps)

        props.className = this.prepareClassName(props, this.state)
        props.style = this.prepareStyle(props)

        props.onMouseEnter = this.handleMouseEnter
        props.onMouseLeave = this.handleMouseLeave

        delete props.data
        delete props.cellPadding

        return props
    },

    handleMouseLeave: function(event){
        this.setState({
            mouseOver: false
        })

        if (this.props.onMouseLeave){
            this.props.onMouseLeave(event)
        }
    },

    handleMouseEnter: function(event){
        this.setState({
            mouseOver: true
        })

        if (this.props.onMouseEnter){
            this.props.onMouseEnter(event)
        }
    },

    renderCell: function(props, column, index){

        var text = props.data[column.name]

        var cellProps = {
            key        : column.name,
            name       : column.name,
            data       : props.data,
            columns    : props.columns,
            index      : index,
            rowIndex   : props.index,
            textPadding: props.cellPadding,
            renderCell : props.renderCell,
            renderText : props.renderText
        }

        if (typeof column.render == 'function'){
            text = column.render(text, props.data, cellProps)
        }

        cellProps.text = text

        var result

        if (props.cellFactory){
            result = props.cellFactory(cellProps)
        }

        if (result === undefined){
            result = CellFactory(cellProps)
        }

        return result
    },

    prepareClassName: function(props, state){
        var className = props.className || ''

        className += ' ' + props.defaultClassName

        if (state.mouseOver){
            className += ' ' + props.mouseOverCls
        }

        return className
    },

    prepareStyle: function(props){

        var style = assign({}, props.defaultStyle, props.style)

        style.height = props.rowHeight

        return style
    }
})

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
        index  : React.PropTypes.number.isRequired
    },

    getDefaultProps: function(){

        return {
            defaultClassName: 'z-row',
            cellClassName   : 'z-cell',
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

        var cells = props.columns.map(this.renderCell.bind(this, props), this)

        return React.DOM.div({
            'data-index': props.index,
            onMouseOver: this.handleMouseOver,
            onMouseOut : this.handleMouseOut,
            style      : props.style,
            className  : props.className
        }, cells)
    },

    prepareProps: function(thisProps){
        var props = assign({}, thisProps)

        this.prepareClassName(props, this.state)
        this.prepareStyle(props)

        return props
    },

    handleMouseOut: function(){
        this.setState({
            mouseOver: false
        })
    },

    handleMouseOver: function(){
        this.setState({
            mouseOver: true
        })
    },

    renderCell: function(props, column, index){

        var text        = props.data[column.name]
        var className   = props.cellClassName

        var cellProps = {
            key        : column.name,
            data       : props.data,
            className  : className,
            columns    : props.columns,
            index      : index,
            rowIndex   : props.index,
            textPadding: props.cellPadding,
            renderCell : props.renderCell,
            renderText : props.renderText,
            text       : text
        }

        return (props.cellFactory || CellFactory)(cellProps)
    },

    prepareClassName: function(props, state){
        props.className = props.className || ''
        props.className += ' ' + props.defaultClassName

        if (state.mouseOver){
            props.className += ' ' + props.mouseOverCls
        }
    },

    prepareStyle: function(props){
        props.style = assign({}, props.defaultStyle)
        props.style.height = props.rowHeight
    }
})

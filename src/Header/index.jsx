'use strict';

var React    = require('react')
var assign   = require('object-assign')
var humanize = require('ustring').humanize
var Cell     = require('../Cell')

module.exports = React.createClass({

    displayName: 'ReactDataGrid.Header',

    propTypes: {
        columns: React.PropTypes.array
    },

    getDefaultProps: function(){

        return {
            defaultClassName: 'z-header-wrapper',
            cellClassName   : 'z-column-header',
            defaultStyle    : {},
            scrollLeft: 0,
            scrollTop : 0
        }
    },

    render: function() {

        var props = this.prepareProps(this.props)

        var cells = props.columns.map(this.renderCell.bind(this, props), this)

        var headerStyle = {
            paddingRight: props.scrollbarSize,
            transform   : 'translate3d(' + -props.scrollLeft + 'px, ' + -props.scrollTop + 'px, 0px)'
        }

        return React.DOM.div({
            style    : props.style,
            className: props.className
        }, <div className='z-header' style={headerStyle}>{cells}</div>)
    },

    renderCell: function(props, column, index){

        var text      = column.title || humanize(column.name)
        var className = props.cellClassName

        return <Cell key={column.name} textPadding={props.cellPadding} columns={props.columns} index={index} className={className} text={text} />
    },

    prepareProps: function(thisProps){
        var props = {}

        assign(props, thisProps)

        this.prepareClassName(props)
        this.prepareStyle(props)

        return props
    },

    prepareClassName: function(props){
        props.className = props.className || ''
        props.className += ' ' + props.defaultClassName
    },

    prepareStyle: function(props){
        var style = props.style = {}

        assign(style, props.defaultStyle)

        style.height = props.rowHeight
    }
})

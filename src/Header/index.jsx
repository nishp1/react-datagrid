'use strict';

var React    = require('react')
var assign   = require('object-assign')
var clone    = require('clone')
var humanize = require('ustring').humanize
var asArray = require('../utils/asArray')
var Cell     = require('../Cell')

function emptyFn(){}

function findIndexBy(arr, fn){

    var i = 0
    var len = arr.length

    for (; i < len; i++){
        if (fn(arr[i]) === true){
            return i
        }
    }

    return -1
}

function getColumnSortInfo(column, sortInfo){

    sortInfo = asArray(sortInfo)

    var index = findIndexBy(sortInfo, function(info){
        return info.name === column.name
    })

    return sortInfo[index]
}

function removeColumnSort(column, sortInfo){
    sortInfo = asArray(sortInfo)

    var index = findIndexBy(sortInfo, function(info){
        return info.name === column.name
    })

    if (~index){
        sortInfo.splice(index, 1)
    }

    return sortInfo
}

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
            sortInfo        : null,
            scrollLeft      : 0,
            scrollTop       : 0
        }
    },

    getInitialState: function(){

        return {
            mouseOver: false
        }
    },

    render: function() {

        var props = this.prepareProps(this.props)

        var cells = props.columns.map(this.renderCell.bind(this, props, this.state), this)

        var headerStyle = {
            paddingRight: props.scrollbarSize,
            transform   : 'translate3d(' + -props.scrollLeft + 'px, ' + -props.scrollTop + 'px, 0px)'
        }

        return React.DOM.div({
            style    : props.style,
            className: props.className
        }, <div className='z-header' style={headerStyle}>{cells}</div>)
    },

    renderCell: function(props, state, column, index){

        var text      = column.title || humanize(column.name)
        var className = props.cellClassName || ''

        var menu = props.withColumnMenu?
                    <div className="z-show-menu" />:
                    null

        var filter  = column.filterable === false || props.filterableColumns === false?
                        null:
                        <div className="z-show-filter" on/>

        var resizer = column.resizable === false || props.resizableColumns === false?
                        null:
                        <span className="z-column-resize" />

        var sortable = this.isSortable(column)

        if (sortable){
            text = <span>{text}<span className="z-icon-sort-info" /></span>

            var sortInfo = getColumnSortInfo(column, props.sortInfo)

            if (sortInfo && sortInfo.dir){
                className += (sortInfo.dir === -1 || sortInfo.dir === 'desc'?
                                ' z-desc':
                                ' z-asc')
            }

            className += ' z-sortable'
        }

        if (filter){
            className += ' z-filterable'
        }

        if (state.mouseOver === column.name){
            className += ' z-over'
        }

        className += ' z-unselectable'

        return (
            <Cell
                key={column.name}
                textPadding={props.cellPadding}
                columns={props.columns}
                index={index}
                className={className}
                text={text}
                onMouseOver={this.handleMouseOver.bind(this, column)}
                onMouseOut={this.handleMouseOut.bind(this, column)}
                onClick={this.handleClick.bind(this, column)}
            >
                {filter}
                {menu}
                {resizer}
            </Cell>
        )
    },

    isSortable: function(column){
        return column.sortable !== false && this.props.sortable
    },

    toggleSort: function(column){
        var sortInfo       = asArray(clone(this.props.sortInfo))
        var columnSortInfo = getColumnSortInfo(column, sortInfo)

        if (!columnSortInfo){
            columnSortInfo = {
                name: column.name,
                type: column.type,
                fn  : column.sortFn
            }

            sortInfo.push(columnSortInfo)
        }

        if (typeof column.toggleSort === 'function'){
            column.toggleSort(columnSortInfo, sortInfo)
        } else {

            var dir = columnSortInfo.dir
            var dirSign = dir === 'asc'? 1 : dir === 'desc'? -1: dir
            var newDir  = dirSign === 1? -1: dirSign === -1?  0: 1

            columnSortInfo.dir = newDir

            if (!newDir){
                sortInfo = removeColumnSort(column, sortInfo)
            }
        }

        ;(this.props.onSortChange || emptyFn)(sortInfo)
    },

    handleClick: function(column, event){
        var sortable = this.isSortable(column)

        if (sortable){
            this.toggleSort(column)
        }
    },

    handleMouseOut: function(column){
        this.setState({
            mouseOver: false
        })
    },

    handleMouseOver: function(column){
        this.setState({
            mouseOver: column.name
        })
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

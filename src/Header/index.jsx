'use strict';

var React   = require('react')
var Region  = require('region')
var ReactMenu = React.createFactory(require('react-menus'))
var assign  = require('object-assign')
var clone   = require('clone')
var asArray = require('../utils/asArray')
var Cell    = require('../Cell')

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
            mouseOver : true
        }
    },

    render: function() {

        var props = this.prepareProps(this.props)

        var cells = props.columns
                        .map(this.renderCell.bind(this, props, this.state))

        var headerStyle = {
            paddingRight: props.scrollbarSize,
            transform   : 'translate3d(' + -props.scrollLeft + 'px, ' + -props.scrollTop + 'px, 0px)'
        }

        return (
            <div style={props.style} className={props.className}>
                <div className='z-header' style={headerStyle}>
                    {cells}
                </div>
            </div>
        )
    },

    renderCell: function(props, state, column, index){

        var text      = column.title
        var className = props.cellClassName || ''

        var menu = this.renderColumnMenu(props, state, column, index)

        var filter  = column.filterable?
                        <div className="z-show-filter" onClick={this.handleFilterClick.bind(this, column)}/>:
                        null

        var resizer = column.resizable?
                        <span className="z-column-resize" />:
                        null

        if (column.sortable){
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

        if (props.menuColumn === column.name){
            className += ' z-active'
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

            var dir     = columnSortInfo.dir
            var dirSign = dir === 'asc'? 1 : dir === 'desc'? -1: dir
            var newDir  = dirSign === 1? -1: dirSign === -1?  0: 1

            columnSortInfo.dir = newDir

            if (!newDir){
                sortInfo = removeColumnSort(column, sortInfo)
            }
        }

        ;(this.props.onSortChange || emptyFn)(sortInfo)
    },

    renderColumnMenu: function(props, state, column, index){
        if (!props.withColumnMenu){
            return
        }

        return <div className="z-show-menu" onClick={this.handleShowMenuClick.bind(this, props, column, index)} />
    },

    handleShowMenuClick: function(props, column, index, event){
        event.stopPropagation()

        var dom = this.getDOMNode()
        var domRegion    = Region.from(dom)
        var targetRegion = Region.from(event.target)
        var offset = event.pageX - targetRegion.left

        var menuOffset = {
            left: event.pageX - domRegion.left - offset
        }

        if (index === props.columns.length - 1){
            offset = targetRegion.right - event.pageX
            menuOffset = {
                right: domRegion.right - event.pageX - offset
            }
        }

        this.showMenu(column, menuOffset, event)
    },

    showMenu: function(column, offset){

        var callback = function(column){
            return function(){
                this.toggleColumn(column)
            }
        }

        var menuItem = function(column){
            return {
                cls  : column.hidden? '': ' z-selected',
                label: column.title,
                fn   : callback(column).bind(this)
            }
        }.bind(this)

        function menu(props){

            props.items = this.props.allColumns.map(menuItem)

            return ReactMenu(props)
        }

        this.props.showColumnMenu(menu.bind(this), column.name, offset)
    },

    toggleColumn: function(column){
        this.props.toggleColumn(column)
    },

    hideMenu: function(){
        this.props.showColumnMenu(null, null)
    },

    handleFilterClick: function(column, event){
        event.stopPropagation()
    },

    handleClick: function(column){
        if (column.sortable){
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
    }
})

'use strict';

var React    = require('react')
var assign   = require('object-assign')
var LoadMask = require('react-load-mask')
var clone    = require('clone')

var PropTypes = require('./PropTypes')
var Wrapper   = require('./Wrapper')
var Header   = require('./Header')
var WrapperFactory = React.createFactory(Wrapper)
var HeaderFactory = React.createFactory(Header)

module.exports = React.createClass({

    displayName: 'ReactDataGrid',

    propTypes: {
        loading         : React.PropTypes.bool,
        virtualRendering: React.PropTypes.bool,

        //specify false if you don't any column to be resizable
        resizableColumns : React.PropTypes.bool,
        filterableColumns: React.PropTypes.bool,
        withColumnMenu   : React.PropTypes.bool,
        cellEllipsis     : React.PropTypes.bool,
        sortable         : React.PropTypes.bool,
        idProperty       : React.PropTypes.string.isRequired,

        scrollBy        : PropTypes.numeric,
        rowHeight       : PropTypes.numeric,
        sortInfo        : PropTypes.sortInfo
    },

    getDefaultProps: require('./getDefaultProps'),

    getInitialState: function(){
        return {
            scrollLeft: 0,
            scrollTop : 0,
            renderStartIndex: 0
        }
    },

    handleScrollLeft: function(scrollLeft){
        this.setState({
            scrollLeft: scrollLeft
        })
    },

    handleScrollTop: function(scrollTop){
        var state = {}

        if (this.props.virtualRendering){
            state.renderStartIndex = Math.ceil(scrollTop / this.props.rowHeight)
        } else {
            state.scrollTop = scrollTop
        }

        this.setState(state)
    },

    getRenderEndIndex: function(){
        var props      = this.props
        var startIndex = this.state.renderStartIndex
        var rowCount   = props.rowCountBuffer

        if (!rowCount){
            var maxHeight
            if (props.style && typeof props.style.height === 'number'){
                maxHeight = props.style.height
            } else {
                maxHeight = window.innerHeight
            }
            rowCount = Math.floor(maxHeight / props.rowHeight)
        }

        var endIndex = startIndex + rowCount

        if (endIndex > props.data.length - 1){
            endIndex = props.data.length
        }

        return endIndex
    },

    render: function(){
        var props = this.prepareProps(this.props)

        var header = (props.headerFactory || HeaderFactory)({
            scrollLeft      : this.state.scrollLeft,
            columns         : props.columns,
            cellPadding     : props.cellPadding,
            scrollbarSize   : props.scrollbarSize,
            sortInfo        : props.sortInfo,
            resizableColumns: props.resizableColumns,
            filterableColumns: props.filterableColumns,
            withColumnMenu  : props.withColumnMenu,
            sortable  : props.sortable,
            onSortChange: props.onSortChange
        })

        var wrapper = this.prepareWrapper(props)

        var footer = (props.footerFactory || React.DOM.div)({
            className: 'z-footer-wrapper'
        })

        return (
            <div className={props.className} style={props.style}>
                <div className="z-inner">
                    {header}
                    {wrapper}
                    {footer}
                </div>

                <LoadMask visible={props.loading} />
            </div>
        )
    },

    prepareWrapper: function(props){
        var data       = props.data
        var scrollTop  = this.state.scrollTop
        var startIndex = this.state.renderStartIndex
        var endIndex   = props.virtualRendering?
                            this.getRenderEndIndex():
                            0

        if (startIndex > data.length - 1){
            startIndex = 0
        }

        if (props.virtualRendering){
            scrollTop = startIndex * props.rowHeight
        }

        var wrapperProps = assign({
            scrollLeft      : this.state.scrollLeft,
            scrollTop       : scrollTop,
            startIndex      : startIndex,
            totalLength     : data.length,
            endIndex        : endIndex,

            onScrollLeft    : this.handleScrollLeft,
            onScrollTop     : this.handleScrollTop
        }, props)

        wrapperProps.data = props.virtualRendering?
                                data.slice(startIndex, endIndex + 1):
                                data

        return (props.WrapperFactory || WrapperFactory)(wrapperProps)

    },

    prepareProps: function(thisProps){
        var props = assign({}, this.props)

        this.prepareClassName(props)
        this.prepareStyle(props)

        this.prepareColumns(props)

        return props
    },

    prepareColumns: function(props){
        props.columns = clone(props.columns) || []

        this.prepareColumnSizes(props)

        props.columns.forEach(this.prepareColumnStyle.bind(this, props))
    },

    prepareColumnStyle: function(props, column){
        var style    = column.style = {}
        var minWidth = column.minWidth || props.columnMinWidth

        style.minWidth = minWidth

        if (this.isColumnFlexible(column)){
            style.flex = column.flex || 1
        } else {
            style.width = column.width
            style.minWidth = column.width
        }
    },

    prepareColumnSizes: function(props){

        var visibleColumns = props.columns
        var totalWidth     = 0
        var flexCount      = 0

        visibleColumns.forEach(function(column){
            column.minWidth = column.minWidth || props.columnMinWidth

            if (! this.isColumnFlexible(column) ){
                totalWidth += column.width
                // column.sizeValue = column.width
                return 0
            } else if (column.minWidth){
                totalWidth += column.minWidth
            }

            flexCount++

            return column.flex || 1
        }, this)

        props.columnFlexCount  = flexCount
        props.totalColumnWidth = totalWidth
    },

    isColumnFlexible: function(column){
        return !column.width
    },

    isColumnHidden: function(column){
        return !!column.hidden
    },

    prepareStyle: function(props){
        var style = {}

        assign(style, props.defaultStyle)
        assign(style, props.style)

        props.style = style
    },

    prepareClassName: function(props){
        props.className = props.className || ''
        props.className += props.defaultClassName

        if (props.cellEllipsis){
            props.className += ' ' + props.cellEllipsisCls
        }

        if (props.styleAlternateRows){
            props.className += ' ' + props.styleAlternateRowsCls
        }

        if (props.showCellBorders){
            var cellBordersCls = props.showCellBorders === true?
                                    props.showCellBordersCls + '-horizontal ' + props.showCellBordersCls + '-vertical':
                                    props.showCellBordersCls + '-' + props.showCellBorders

            props.className += ' ' + cellBordersCls

        }

        if (props.withColumnMenu){
            props.className += ' ' + props.withColumnMenuCls
        }
    }
})
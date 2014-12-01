'use strict';

var React    = require('react')
var assign   = require('object-assign')
var LoadMask = require('react-load-mask')

var Column = require('./models/Column')

var PropTypes = require('./PropTypes')
var Wrapper   = require('./Wrapper')
var Header   = require('./Header')
var WrapperFactory = React.createFactory(Wrapper)
var HeaderFactory = React.createFactory(Header)

function emptyFn(){}

function findColumn(columns, column){
    var col

    columns.some(function(it){

        if (it.name === column.name){
            col = it
            return true
        }
    })

    return col
}

module.exports = React.createClass({

    displayName: 'ReactDataGrid',

    propTypes: {
        loading          : React.PropTypes.bool,
        virtualRendering : React.PropTypes.bool,

        //specify false if you don't any column to be resizable
        resizableColumns : React.PropTypes.bool,
        filterableColumns: React.PropTypes.bool,
        withColumnMenu   : React.PropTypes.bool,
        cellEllipsis     : React.PropTypes.bool,
        sortable         : React.PropTypes.bool,
        idProperty       : React.PropTypes.string.isRequired,

        /**
         * @cfg {Number/String} columnMinWidth=50
         */
        columnMinWidth   : PropTypes.numeric,
        scrollBy         : PropTypes.numeric,
        rowHeight        : PropTypes.numeric,
        sortInfo         : PropTypes.sortInfo,
        columns          : PropTypes.column
    },

    getDefaultProps: require('./getDefaultProps'),

    componentDidMount: function(){
        window.addEventListener('click', this.windowClickListener = this.onWindowClick)
    },

    componentWillUnmount: function(){
        window.removeEventListener('click', this.windowClickListener)
    },

    onWindowClick: function(){
        if (this.state.menuColumn){
            this.setState({
                menuColumn: null,
                menu      : null
            })
        }
    },

    getInitialState: function(){
        return {
            scrollLeft: 0,
            scrollTop : 0,
            renderStartIndex: 0,
            menuColumn: null
        }
    },

    handleScrollLeft: function(scrollLeft){
        this.setState({
            scrollLeft: scrollLeft,
            menuColumn: null
        })
    },

    handleScrollTop: function(scrollTop){
        var state = {
            menuColumn: null
        }

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

    toggleColumn: function(column){

        column = findColumn(this.props.columns, column)

        var visible = !column.hidden

        var onHide  = this.props.onColumnHide || emptyFn
        var onShow  = this.props.onColumnShow || emptyFn

        if (visible){
            onHide(column)
        } else {
            onShow(column)
        }

        var onChange = this.props.onColumnVisibilityChange || emptyFn
        onChange(column, !visible)
    },

    showColumnMenu: function(menu, column, menuOffset, event){
        this.setState({
            menu: menu,
            menuColumn: column,
            menuOffset: menuOffset
        })
    },

    render: function(){
        var props = this.prepareProps(this.props)

        var header = (props.headerFactory || HeaderFactory)({
            scrollLeft       : this.state.scrollLeft,
            columns          : props.columns.filter(c => c.visible),
            allColumns       : props.columns,
            cellPadding      : props.cellPadding,
            scrollbarSize    : props.scrollbarSize,
            sortInfo         : props.sortInfo,
            resizableColumns : props.resizableColumns,
            filterableColumns: props.filterableColumns,
            withColumnMenu   : props.withColumnMenu,
            sortable         : props.sortable,
            onSortChange     : props.onSortChange,
            showColumnMenu   : this.showColumnMenu,
            menuColumn       : this.state.menuColumn,
            toggleColumn     : this.toggleColumn
        })

        var wrapper = this.prepareWrapper(props, this.state)

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

    prepareWrapper: function(props, state){
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
            onScrollTop     : this.handleScrollTop,
            menu            : state.menu,
            menuColumn      : state.menuColumn,
            menuOffset      : state.menuOffset
        }, props)

        wrapperProps.columns = props.columns.filter(c => c.visible)
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
    },

    ///////////////////////////////////////
    ///
    /// Code dealing with preparing columns
    ///
    ///////////////////////////////////////
    prepareColumns: function(props){
        props.columns = props.columns.map(c => Column(c, props))

        this.prepareColumnSizes(props)

        props.columns.forEach(this.prepareColumnStyle.bind(this, props))
    },

    prepareColumnStyle: function(props, column){
        var style    = column.style = {}
        var minWidth = column.minWidth || props.columnMinWidth

        style.minWidth = minWidth

        if (column.flexible){
            style.flex = column.flex || 1
        } else {
            style.width    = column.width
            style.minWidth = column.width
        }
    },

    prepareColumnSizes: function(props){

        var visibleColumns = props.columns.filter(c => c.visible)
        var totalWidth     = 0
        var flexCount      = 0

        visibleColumns.forEach(function(column){
            column.minWidth = column.minWidth || props.columnMinWidth

            if (!column.flexible){
                totalWidth += column.width
                return 0
            } else if (column.minWidth){
                totalWidth += column.minWidth
            }

            flexCount++
        }, this)

        props.columnFlexCount  = flexCount
        props.totalColumnWidth = totalWidth
    }
})
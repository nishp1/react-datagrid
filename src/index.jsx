'use strict';

var React    = require('react')
var assign   = require('object-assign')
var LoadMask = require('react-load-mask')
var Region   = require('region')

var Column = require('./models/Column')

var PropTypes      = require('./PropTypes')
var Wrapper        = require('./Wrapper')
var Header         = require('./Header')
var WrapperFactory = React.createFactory(Wrapper)
var HeaderFactory  = React.createFactory(Header)

var findIndexByName = require('./utils/findIndexByName')
var group           = require('./utils/group')

var slice          = require('./render/slice')
var renderTable    = require('./render/renderTable')
var getGroupedRows = require('./render/getGroupedRows')

function emptyFn(){}

function getVisibleCount(columns){
    return columns.filter(c => c.visible).length
}

function findColumn(columns, column){

    var name = typeof column === 'string'? column: column.name
    var index = findIndexByName(columns, name)

    if (~index){
        return columns[index]
    }
}

module.exports = React.createClass({

    displayName: 'ReactDataGrid',

    mixins: [
        require('./RowSelect')
    ],

    propTypes: {
        loading          : React.PropTypes.bool,
        virtualRendering : React.PropTypes.bool,

        //specify false if you don't want any column to be resizable
        resizableColumns : React.PropTypes.bool,
        filterableColumns: React.PropTypes.bool,

        //specify false if you don't want column menus to be displayed
        withColumnMenu   : React.PropTypes.bool,
        cellEllipsis     : React.PropTypes.bool,
        sortable         : React.PropTypes.bool,
        idProperty       : React.PropTypes.string.isRequired,

        //you can customize the column menu by specifying a factory
        columnMenuFactory: React.PropTypes.func,

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

    onWindowClick: function(event){
        if (this.state.menu){
            this.setState({
                menuColumn: null,
                menu      : null
            })
        }
    },

    getInitialState: function(){

        var props = this.props
        var defaultSelected = props.defaultSelected

        return {
            scrollLeft: 0,
            scrollTop : 0,
            renderStartIndex: 0,
            menuColumn: null,
            defaultSelected: defaultSelected
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

    getRenderEndIndex: function(props, state){
        var startIndex = state.renderStartIndex
        var rowCount   = props.rowCountBuffer
        var length     = props.data.length

        if (state.groupData){
            length += state.groupData.groupsCount
        }

        if (!rowCount){
            var maxHeight
            if (props.style && typeof props.style.height === 'number'){
                maxHeight = props.style.height
            } else {
                maxHeight = window.screen.height
            }
            rowCount = Math.floor(maxHeight / props.rowHeight)
        }

        var endIndex = startIndex + rowCount

        if (endIndex > length - 1){
            endIndex = length
        }

        return endIndex
    },

    onDropColumn: function(index, dropIndex){
        ;(this.props.onColumnOrderChange || emptyFn)(index, dropIndex)
    },

    toggleColumn: function(props, column){

        var visible = column.visible

        column = findColumn(this.props.columns, column)

        if (visible && getVisibleCount(props.columns) === 1){
            return
        }

        var onHide  = this.props.onColumnHide || emptyFn
        var onShow  = this.props.onColumnShow || emptyFn

        visible?
            onHide(column):
            onShow(column)

        var onChange = this.props.onColumnVisibilityChange || emptyFn

        onChange(column, !visible)

        if (column.defaultVisible != null){
            //stateful behaviour
            column.defaultVisible = !visible
            this.setState({})
        }
    },

    showMenu: function(menu, state){

        state = state || {}
        state.menu = menu

        if (this.state.menu){
            this.setState({
                menu: null
            })
        }

        setTimeout(function(){
            //since menu is hidden on click on window,
            //show it in a timeout, after the click event has reached the window
            this.setState(state)
        }.bind(this), 0)
    },

    showRowMenu: function(menu, rowProps){

    },

    prepareHeader: function(props, state){

        var allColumns = props.columns
        var columns    = props.columns.filter(c => c.visible)

        return (props.headerFactory || HeaderFactory)({
            scrollLeft       : state.scrollLeft,
            resizing         : state.resizing,
            columns          : columns,
            allColumns       : allColumns,
            cellPadding      : props.cellPadding,
            scrollbarSize    : props.scrollbarSize,
            sortInfo         : props.sortInfo,
            resizableColumns : props.resizableColumns,
            filterableColumns: props.filterableColumns,
            withColumnMenu   : props.withColumnMenu,
            sortable         : props.sortable,

            onDropColumn     : this.onDropColumn,
            onSortChange     : props.onSortChange,
            onColumnResizeDragStart: this.onColumnResizeDragStart,
            onColumnResizeDrag: this.onColumnResizeDrag,
            onColumnResizeDrop: this.onColumnResizeDrop,

            toggleColumn     : this.toggleColumn.bind(this, props),
            showMenu         : this.showMenu,
            menuColumn       : state.menuColumn,
            columnMenuFactory: props.columnMenuFactory

        })
    },

    prepareFooter: function(props, state){
        return (props.footerFactory || React.DOM.div)({
            className: 'z-footer-wrapper'
        })
    },

    prepareRenderProps: function(props){

        var result = {}
        var list = {
            className: true,
            style: true
        }

        Object.keys(props).forEach(function(name){
            // if (list[name] || name.indexOf('data-') == 0 || name.indexOf('on') === 0){
            if (list[name]){
                result[name] = props[name]
            }
        })

        return result
    },

    render: function(){
        var props = this.prepareProps(this.props)

        var header      = this.prepareHeader(props, this.state)
        var wrapper     = this.prepareWrapper(props, this.state)
        var footer      = this.prepareFooter(props, this.state)
        var resizeProxy = this.prepareResizeProxy(props, this.state)

        var renderProps = this.prepareRenderProps(props)

        return (
            <div {...renderProps}>
                <div className="z-inner">
                    {header}
                    {wrapper}
                    {footer}
                </div>

                <LoadMask visible={props.loading} />
                {resizeProxy}
            </div>
        )
    },

    renderTable: function(props, state){
        var table
        var rows

        if (props.groupBy){
            rows = this.groupedRows = this.groupedRows || getGroupedRows(props, state.groupData)
            rows = slice(rows, props)
        }

        table = renderTable.call(this, props, rows)

        return table
    },

    prepareWrapper: function(props, state){
        var virtualRendering = props.virtualRendering

        var data       = props.data
        var scrollTop  = state.scrollTop
        var startIndex = state.renderStartIndex
        var endIndex   = virtualRendering?
                            this.getRenderEndIndex(props, state):
                            0

        var renderCount = virtualRendering?
                            endIndex + 1 - startIndex:
                            data.length

        if (props.virtualRendering){
            scrollTop = startIndex * props.rowHeight
        }

        var wrapperProps = assign({
            scrollLeft      : state.scrollLeft,
            scrollTop       : scrollTop,
            startIndex      : startIndex,
            totalLength     : data.length,
            renderCount     : renderCount,
            endIndex        : endIndex,

            allColumns      : props.columns,

            onScrollLeft    : this.handleScrollLeft,
            onScrollTop     : this.handleScrollTop,

            menu            : state.menu,
            menuColumn      : state.menuColumn,
            showMenu        : this.showMenu,

            cellFactory     : props.cellFactory,
            rowStyle        : props.rowStyle,
            rowClassName    : props.rowClassName,
            rowContextMenu  : props.rowContextMenu,

            onRowClick: this.handleRowClick,
            selected        : props.selected == null?
                                    state.defaultSelected:
                                    props.selected
        }, props)

        wrapperProps.columns = props.columns.filter(c => c.visible)
        wrapperProps.table   = this.renderTable(wrapperProps, state)

        return (props.WrapperFactory || WrapperFactory)(wrapperProps)

    },

    handleRowClick: function(rowProps, event){
        if (this.props.onRowClick){
            this.props.onRowClick(rowProps.data, rowProps, event)
        }

        this.handleSelection(rowProps, event)
    },

    prepareProps: function(thisProps){
        var props = assign({}, thisProps)

        this.prepareClassName(props)
        props.style = this.prepareStyle(props)

        this.prepareColumns(props)
        // this.groupData(props)

        return props
    },

    groupData: function(props){
        if (props.groupBy){

            this.setState({
                groupData: group(props.data, props.groupBy)
            })
        }

        delete this.groupedRows
    },

    componentWillMount: function(){
        this.groupData(this.props)
    },

    componentWillReceiveProps: function(nextProps){
        this.groupData(nextProps)
    },

    prepareStyle: function(props){
        var style = {}

        assign(style, props.defaultStyle, props.style)

        return style
    },

    prepareClassName: function(props){
        props.className = props.className || ''
        props.className += ' ' + props.defaultClassName

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
    },

    prepareResizeProxy: function(props, state){

        var style = {}

        if (state.resizing){
            style.display = 'block'
            style.left = state.resizeProxyLeft
        }

        return <div className='z-resize-proxy' style={style}></div>
    },

    onColumnResizeDragStart: function(config){

        var domNode = this.getDOMNode()
        var region  = Region.from(domNode)
        var state = config

        state.resizeProxyOffset = state.resizeProxyLeft - region.left
        state.resizeProxyLeft = state.resizeProxyOffset

        this.setState(state)
    },

    onColumnResizeDrag: function(config){
        var resizeProxyOffset = this.state.resizeProxyOffset

        config.resizeProxyLeft = resizeProxyOffset + config.resizeProxyDiff

        this.setState(config)
    },

    onColumnResizeDrop: function(config, resizeInfo){

        var props   = this.props
        var columns = props.columns

        var onColumnResize = props.onColumnResize || emptyFn
        var first = resizeInfo[0]

        var firstCol  = findColumn(columns, first.name)
        var firstSize = first.size

        var second = resizeInfo[1]
        var secondCol = second? findColumn(columns, second.name): undefined
        var secondSize = second? second.size: undefined

        //if defaultWidth specified, update it
        if (firstCol.width == null && firstCol.defaultWidth){
            firstCol.defaultWidth = firstSize
        }

        if (secondCol && secondCol.width == null && secondCol.defaultWidth){
            secondCol.defaultWidth = secondSize
        }

        this.setState(config)

        onColumnResize(firstCol, firstSize, secondCol, secondSize)
    }
})
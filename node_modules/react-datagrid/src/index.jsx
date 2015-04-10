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
var getTableProps    = require('./render/getTableProps')
var getGroupedRows = require('./render/getGroupedRows')
var renderMenu     = require('./render/renderMenu')

var SIZING_ID = '___SIZING___'

function signum(x){
    return x < 0? -1: 1
}

function emptyFn(){}

function getVisibleCount(props, state){
    return getVisibleColumns(props, state).length
}

function getVisibleColumns(props, state){

    var visibility = state.visibility
    var visibleColumns = props.columns.filter(function(c){
        var name = c.name
        var visible = c.visible

        if (name in visibility){
            visible = !!visibility[name]
        }

        return visible
    })

    return visibleColumns
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
        require('./RowSelect'),
        require('./ColumnFilter')
    ],

    propTypes: {
        loading          : React.PropTypes.bool,
        virtualRendering : React.PropTypes.bool,

        //specify false if you don't want any column to be resizable
        resizableColumns : React.PropTypes.bool,
        filterable: React.PropTypes.bool,

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
        // this.checkRowHeight(this.props)
    },

    componentWillUnmount: function(){
        window.removeEventListener('click', this.windowClickListener)
    },

    // checkRowHeight: function(props) {
    //     if (this.isVirtualRendering(props)){

    //         //if virtual rendering and no rowHeight specifed, we use
    //         var row = this.findRowById(SIZING_ID)
    //         var config = {}

    //         if (row){
    //             this.setState({
    //                 rowHeight: config.rowHeight = row.offsetHeight
    //             })
    //         }

    //         //this ensures rows are kept in view
    //         this.updateStartIndex(props, undefined, config)
    //     }
    // },

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
            defaultSelected: defaultSelected,
            visibility: {}
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

            var prevIndex = this.state.renderStartIndex || 0

            var renderStartIndex = Math.ceil(scrollTop / this.props.rowHeight)
            state.renderStartIndex = renderStartIndex

            // // console.log('scroll!');
            // var sign = signum(renderStartIndex - prevIndex)

            // state.topOffset = -sign * Math.ceil(scrollTop - state.renderStartIndex * this.props.rowHeight)

            // console.log(scrollTop, sign);
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
        var visibility = this.state.visibility

        if (column.name in visibility){
            visible = visibility[column.name]
        }

        column = findColumn(this.props.columns, column)

        if (visible && getVisibleCount(props, this.state) === 1){
            return
        }

        var onHide  = this.props.onColumnHide || emptyFn
        var onShow  = this.props.onColumnShow || emptyFn

        visible?
            onHide(column):
            onShow(column)

        var onChange = this.props.onColumnVisibilityChange || emptyFn

        onChange(column, !visible)

        if (column.visible == null && column.hidden == null){
            var visibility = this.state.visibility

            visibility[column.name] = !visible
            this.setState({})
        }
    },

    showMenu: function(menu, state){

        state = state || {}
        state.menu = menu

        if (this.state.menu){
            this.setState({
                menu: null,
                menuColumn: null
            })
        }

        setTimeout(function(){
            //since menu is hidden on click on window,
            //show it in a timeout, after the click event has reached the window
            this.setState(state)
        }.bind(this), 0)
    },

    prepareHeader: function(props, state){

        var allColumns = props.columns
        var columns    = getVisibleColumns(props, state)

        return (props.headerFactory || HeaderFactory)({
            scrollLeft       : state.scrollLeft,
            resizing         : state.resizing,
            columns          : columns,
            allColumns       : allColumns,
            columnVisibility : state.visibility,
            cellPadding      : props.headerPadding || props.cellPadding,
            filterIconColor  : props.filterIconColor,
            menuIconColor    : props.menuIconColor,
            menuIcon    : props.menuIcon,
            filterIcon    : props.filterIcon,
            scrollbarSize    : props.scrollbarSize,
            sortInfo         : props.sortInfo,
            resizableColumns : props.resizableColumns,
            reorderColumns   : props.reorderColumns,
            filterable: props.filterable,
            withColumnMenu   : props.withColumnMenu,
            sortable         : props.sortable,

            onDropColumn     : this.onDropColumn,
            onSortChange     : props.onSortChange,
            onColumnResizeDragStart: this.onColumnResizeDragStart,
            onColumnResizeDrag: this.onColumnResizeDrag,
            onColumnResizeDrop: this.onColumnResizeDrop,

            toggleColumn     : this.toggleColumn.bind(this, props),
            showMenu         : this.showMenu,
            filterMenuFactory : this.filterMenuFactory,
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

        var props = this.prepareProps(this.props, this.state)

        var header      = this.prepareHeader(props, this.state)
        var wrapper     = this.prepareWrapper(props, this.state)
        var footer      = this.prepareFooter(props, this.state)
        var resizeProxy = this.prepareResizeProxy(props, this.state)

        var renderProps = this.prepareRenderProps(props)

        var menuProps = {
            columns: props.columns,
            menu   : this.state.menu
        }

        var loadMask

        if (props.loadMaskOverHeader){
            loadMask = <LoadMask visible={props.loading} />
        }

        return (
            <div {...renderProps}>
                <div className="z-inner">
                    {header}
                    {wrapper}
                    {footer}
                </div>

                {loadMask}
                {resizeProxy}
                {renderMenu(menuProps)}
            </div>
        )
    },

    getTableProps: function(props, state){
        var table
        var rows

        if (props.groupBy){
            rows = this.groupedRows = this.groupedRows || getGroupedRows(props, state.groupData)
            rows = slice(rows, props)
        }

        table = getTableProps.call(this, props, rows)

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
            topOffset       : state.topOffset,
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

            // cellFactory     : props.cellFactory,
            // rowStyle        : props.rowStyle,
            // rowClassName    : props.rowClassName,
            // rowContextMenu  : props.rowContextMenu,

            onRowClick: this.handleRowClick,
            selected        : props.selected == null?
                                    state.defaultSelected:
                                    props.selected
        }, props)

        wrapperProps.columns    = getVisibleColumns(props, state)
        wrapperProps.tableProps = this.getTableProps(wrapperProps, state)

        return (props.WrapperFactory || WrapperFactory)(wrapperProps)

    },

    handleRowClick: function(rowProps, event){
        if (this.props.onRowClick){
            this.props.onRowClick(rowProps.data, rowProps, event)
        }

        this.handleSelection(rowProps, event)
    },

    prepareProps: function(thisProps, state){
        var props = assign({}, thisProps)

        if (!Array.isArray(props.data)){
            props.data = []
        }
        props.empty = !props.data.length
        props.rowHeight = this.prepareRowHeight(props)
        props.virtualRendering = this.isVirtualRendering(props)

        props.filterable = this.prepareFilterable(props)
        props.resizableColumns = this.prepareResizableColumns(props)
        props.reorderColumns = this.prepareReorderColumns(props)

        this.prepareClassName(props)
        props.style = this.prepareStyle(props)

        this.prepareColumns(props, state)
        // this.groupData(props)

        return props
    },

    prepareFilterable: function(props) {
        if (props.filterable === false){
            return false
        }

        return props.filterable || !!props.onFilter
    },

    prepareResizableColumns: function(props) {
        if (props.resizableColumns === false){
            return false
        }

        return props.resizableColumns || !!props.onColumnResize
    },

    prepareReorderColumns: function(props) {
        if (props.reorderColumns === false){
            return false
        }

        return props.reorderColumns || !!props.onColumnOrderChange
    },

    isVirtualRendering: function(props){

        props = props || this.props

        return props.virtualRendering || (props.rowHeight != null)
    },

    prepareRowHeight: function(){
        return this.props.rowHeight == null? this.state.rowHeight: this.props.rowHeight
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

        if (props.empty){
            props.className += ' ' + props.emptyCls
        }
    },

    ///////////////////////////////////////
    ///
    /// Code dealing with preparing columns
    ///
    ///////////////////////////////////////
    prepareColumns: function(props, state){
        props.columns = props.columns.map(function(col, index){
            col = Column(col, props)
            col.index = index
            return col
        }, this)

        this.prepareColumnSizes(props, state)

        props.columns.forEach(this.prepareColumnStyle.bind(this, props))
    },

    prepareColumnStyle: function(props, column){
        var style = column.sizeStyle = {}

        column.style     = assign({}, column.style)
        column.textAlign = column.textAlign || column.style.textAlign

        var minWidth = column.minWidth || props.columnMinWidth

        style.minWidth = minWidth

        if (column.flexible){
            style.flex = column.flex || 1
        } else {
            style.width    = column.width
            style.minWidth = column.width
        }
    },

    prepareColumnSizes: function(props, state){

        var visibleColumns = getVisibleColumns(props, state)
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
'use strict';

var React  = require('react')
var assign = require('object-assign')
var LoadMask = require('react-load-mask')
var hasTouch = require('has-touch')
var DragHelper = require('drag-helper')
var buffer = require('buffer-function')
var raf = require('raf')
var tableStyle = require('../render/tableStyle')

function signum(x){
    return x < 0? -1: 1
}

function getProtectScrollConfig(){
    //THIS
    var tableWrapper = this.refs.tableWrapper.getDOMNode()
    var horizontalScrollbar = this.refs.horizontalScrollbar.getDOMNode()

    var tableHeight   = this.getTableScrollHeight()
    var wrapperHeight = tableWrapper.offsetHeight - horizontalScrollbar.offsetHeight
    var wrapperWidth  = tableWrapper.offsetWidth

    return {
        tableHeight  : tableHeight,
        wrapperHeight: wrapperHeight,
        wrapperWidth : wrapperWidth
    }
}


function protectScrollTop(scrollTop, config){
    //THIS
    config = config || getProtectScrollConfig.call(this)

    var tableHeight   = config.tableHeight
    var wrapperHeight = config.wrapperHeight

    if (scrollTop + wrapperHeight > tableHeight){
        scrollTop = tableHeight - wrapperHeight
    }
    if (scrollTop < 0){
        scrollTop = 0
    }

    return scrollTop
}

function protectScrollLeft(scrollLeft, config){
    //THIS
    config = config || getProtectScrollConfig.call(this)

    var maxWidth   = this.props.totalColumnWidth
    var wrapperWidth = config.wrapperWidth

    if (scrollLeft + wrapperWidth > maxWidth){
        scrollLeft = maxWidth - wrapperWidth
    }
    if (scrollLeft < 0){
        scrollLeft = 0
    }

    return scrollLeft
}

module.exports = React.createClass({

    displayName: 'ReactDataGrid.Wrapper',

    propTypes: {
        scrollLeft      : React.PropTypes.number,
        scrollTop       : React.PropTypes.number,
        scrollbarSize   : React.PropTypes.number,
        totalColumnWidth: React.PropTypes.number,
        cellPadding     : React.PropTypes.oneOfType([
                            React.PropTypes.number,
                            React.PropTypes.string
                        ]),
        rowHeight       : React.PropTypes.any,

        data            : React.PropTypes.array,
        columns         : React.PropTypes.array,
        idProperty      : React.PropTypes.string.isRequired,

        rowFactory      : React.PropTypes.func
    },

    getProtectScrollConfig: function(){
        return getProtectScrollConfig.apply(this, arguments)
    },

    protectScrollTop: function(){
        return protectScrollTop.apply(this, arguments)
    },

    protectScrollLeft: function(){
        return protectScrollLeft.apply(this, arguments)
    },

    getDefaultProps: function(){

        return {
            scrollLeft: 0,
            scrollTop : 0
        }
    },

    syncVerticalScroller: function(){

        var scrollTop = this.props.scrollTop + (this.props.topOffset || 0)

        this.lockVerticalScroll = true
        this.refs.verticalScrollbar.getDOMNode().scrollTop = scrollTop

        raf(function(){
            this.lockVerticalScroll = false
        }.bind(this))
    },

    render: function() {

        var props     = this.prepareProps(this.props)
        var rowsCount = props.renderCount

        var tableProps = props.tableProps

        var groupsCount = 0
        var table = props.table

        if (props.groupData){
            groupsCount = props.groupData.groupsCount
        }

        if (props.virtualRendering){
            rowsCount += groupsCount
        }

        this.groupsCount = groupsCount

        var horizontalScrollerSize = props.totalColumnWidth + props.scrollbarSize
        var verticalScrollerSize   = (props.totalLength + groupsCount) * props.rowHeight

        var events = {}

        if (!hasTouch){
            events.onWheel = this.handleWheel
        } else {
            events.onTouchStart = this.handleTouchStart
        }

        var wrapperStyle = {
            paddingRight: props.empty? 0: props.scrollbarSize
        }

        if (props.empty){
            assign(wrapperStyle, props.emptyWrapperStyle)
        }

        var emptyText

        if (props.empty){
            emptyText = <div className="z-empty-text" style={props.emptyTextStyle}>{props.emptyText}</div>
        }

        var loadMask

        if (!props.loadMaskOverHeader){
            loadMask = <LoadMask visible={props.loading} />
        }

        return (
            <div className="z-wrapper" style={{height: rowsCount * props.rowHeight}}>
                {loadMask}
                <div ref="tableWrapper" className="z-table-wrapper" style={wrapperStyle} {...events}>
                    {emptyText}
                    <div {...tableProps} ref="table"/>
                    <div ref="verticalScrollbar"  className="z-vertical-scrollbar" style={{width: props.scrollbarSize}} onScroll={this.handleVerticalScroll}>
                        <div className="z-vertical-scroller" style={{height: verticalScrollerSize}} />
                    </div>
                    <div className="z-horizontal-scroller" style={{width: horizontalScrollerSize}} />
                </div>
                <div ref="horizontalScrollbar" className="z-horizontal-scrollbar" onScroll={this.handleHorizontalScroll}>
                    <div className="z-horizontal-scroller" style={{width: horizontalScrollerSize}} />
                </div>
            </div>
        )
    },

    handleTouchStart: function(event) {

        var props = this.props
        var table = this.refs.table.getDOMNode()

        var scroll = {
            top : props.scrollTop,
            left: props.scrollLeft
        }

        var protectScrollConfig = this.getProtectScrollConfig()

        var newScrollPos

        var side

        DragHelper(event, {
            scope: this,
            onDrag: buffer(function(event, config) {

                var diffTop = config.diff.top
                var diffLeft = config.diff.top

                var diff

                if (diffTop == 0 && diffLeft == 0){
                    return
                }

                if (!side){
                    side = Math.abs(config.diff.top) > Math.abs(config.diff.left)? 'top': 'left'
                }

                diff = config.diff[side]

                newScrollPos = scroll[side] - diff

                if (side == 'top'){
                    newScrollPos = this.protectScrollTop(newScrollPos, protectScrollConfig)
                } else {
                    newScrollPos = this.protectScrollLeft(newScrollPos, protectScrollConfig)
                }

                if (props.virtualRendering && side == 'top'){
                    this.verticalScrollAt(newScrollPos)
                    return
                }

                if (side == 'left'){
                    this.horizontalScrollAt(newScrollPos)
                    return
                }

                var tableStyleProps = {
                    virtualRendering: props.virtualRendering,
                    scrollLeft      : scroll.left,
                    scrollTop       : scroll.top
                }

                if (side == 'top'){
                    tableStyleProps.scrollTop = newScrollPos
                } else {
                    tableStyleProps.scrollLeft = newScrollPos
                }

                var style = tableStyle(tableStyleProps)

                Object.keys(style).forEach(function(k){
                    var value = style[k]
                    table.style[k] = value
                })

            }, -1),
            onDrop: function(){

                if (!side){
                    return
                }

                if (side == 'left'){
                    return
                }

                if (!props.virtualRendering){
                    props.onScrollTop(newScrollPos)
                } else {
                    this.verticalScrollAt(newScrollPos)
                }
            }
        })

        event.stopPropagation()
        event.preventDefault()
    },

    horizontalScrollAt: function(scrollLeft) {
        this.props.onScrollLeft(scrollLeft)
    },

    handleWheel: function(event){

        var delta = event.deltaY

        if (delta && Math.abs(delta) < 40){
            delta = signum(delta) * 40
        }

        if (event.shiftKey){

            if (!delta){
                delta = event.deltaX
            }

            var horizontalScrollbar = this.refs.horizontalScrollbar
            var domNode             = horizontalScrollbar.getDOMNode()
            var pos                 = domNode.scrollLeft

            if (delta < 0 && pos == 0){
                //no need to stop propagation
                //we allow the event to propagate so the browser
                //scrolls parent dom elements if needed
                return
            }

            domNode.scrollLeft = pos + delta

            // if (delta > 0 && domNode.scrollLeft == pos){
            //     //the grid was not scrolled
            //     this.refs.tableWrapper.getDOMNode().scrollLeft = 0
            //     return
            // }

            event.stopPropagation()
            event.preventDefault()

            return
        }

        this.addMouseWheelDelta(delta)

        if (this.props.virtualRendering){
            if (delta < 0 && this.props.scrollTop == 0){
                //if scrolling to upwards and already there
                return
            }

            if (delta > 0 && this.props.endIndex >= this.props.data.length - 1){
                //if scrolling downwards and already there
                return
            }

            event.stopPropagation()
            event.preventDefault()
        }
    },


    getTableScrollHeight: function(){
        var props  = this.props
        var result = props.virtualRendering?
                        (props.totalLength + this.groupsCount || 0) * props.rowHeight:
                        this.refs.table.getDOMNode().offsetHeight

        return result
    },

    addMouseWheelDelta: function(deltaY){

        var props   = this.props
        var virtual = props.virtualRendering

        var tableHeight         = this.getTableScrollHeight()
        var tableWrapper        = this.refs.tableWrapper.getDOMNode()
        var horizontalScrollbar = this.refs.horizontalScrollbar.getDOMNode()
        var wrapperHeight       = tableWrapper.offsetHeight - horizontalScrollbar.offsetHeight

        var scrollTop = props.scrollTop

        if (virtual && deltaY < 0 && -deltaY < props.rowHeight){
            //when scrolling to go up, account for the case where abs(deltaY)
            //is less than the rowHeight, as this results in no scrolling
            //so make sure it's at least deltaY
            deltaY = -props.rowHeight
        }

        if (virtual && props.scrollBy){
            deltaY = signum(deltaY) * props.scrollBy * props.rowHeight
        }

        scrollTop += deltaY

        scrollTop = this.protectScrollTop(scrollTop)

        this.verticalScrollAt(scrollTop, deltaY)
    },
    verticalScrollAt: function(scrollTop){

        this.onVerticalScroll(scrollTop)

        raf(function(){
            this.syncVerticalScroller()
        }.bind(this))
    },
    handleHorizontalScroll: function(event){
        this.props.onScrollLeft(event.target.scrollLeft)
    },
    handleVerticalScroll: function(event){
        !this.lockVerticalScroll && this.onVerticalScroll(event.target.scrollTop)
    },
    onVerticalScroll: function(pos){
        this.props.onScrollTop(pos)
    },
    prepareProps: function(thisProps){
        var props = {}

        assign(props, thisProps)

        return props
    }
})

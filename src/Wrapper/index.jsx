'use strict';

var React  = require('react')
var assign = require('object-assign')

var renderTable        = require('./renderTable')
var renderGroupedTable = require('./renderGroupedTable')

function signum(x){
    return x < 0? -1: 1
}

module.exports = React.createClass({

    displayName: 'ReactDataGrid.Wrapper',

    propTypes: {
        scrollLeft      : React.PropTypes.number,
        scrollTop       : React.PropTypes.number,
        scrollbarSize   : React.PropTypes.number,
        totalColumnWidth: React.PropTypes.number,
        cellPadding     : React.PropTypes.number,
        rowHeight       : React.PropTypes.any,

        data            : React.PropTypes.array,
        columns         : React.PropTypes.array,
        idProperty      : React.PropTypes.string.isRequired,

        rowFactory      : React.PropTypes.func
    },

    getDefaultProps: function(){

        return {
            scrollLeft: 0,
            scrollTop : 0
        }
    },

    syncVerticalScroller: function(){

        var scrollTop = this.props.scrollTop

        this.refs.verticalScrollbar.getDOMNode().scrollTop = scrollTop
    },

    render: function() {

        var props     = this.prepareProps(this.props)
        var rowsCount = props.data.length

        var counter = { length: 0 }
        var table

        if (props.groupData){
            table = renderGroupedTable(props, counter)
        } else {
            table = renderTable(props)
        }

        rowsCount += counter.length
        this.groupsCount = counter.length

        var horizontalScrollerSize = props.totalColumnWidth + props.scrollbarSize
        var verticalScrollerSize   = (props.totalLength + counter.length) * props.rowHeight

        return (
            <div className="z-wrapper" style={{height: rowsCount * props.rowHeight}}>
                <div ref="tableWrapper" className="z-table-wrapper" style={{paddingRight: props.scrollbarSize}} onWheel={this.handleWheel}>
                    {table}
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

    handleWheel: function(event){
        event.stopPropagation()
        event.preventDefault()

        var delta = event.deltaY

        if (delta && Math.abs(delta) < 40){
            delta = signum(delta) * 40
        }

        if (event.shiftKey){

            if (!delta){
                delta = event.deltaX
            }

            var horizontalScrollbar = this.refs.horizontalScrollbar
            horizontalScrollbar.getDOMNode().scrollLeft += delta
            return
        }

        this.addMouseWheelDelta(delta)
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

        var scrollTop = virtual?
                            props.startIndex * props.rowHeight:
                            props.scrollTop

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

        if (scrollTop + wrapperHeight > tableHeight){
            scrollTop = tableHeight - wrapperHeight
        }
        if (scrollTop < 0){
            scrollTop = 0
        }

        this.onVerticalScroll(scrollTop)

        setTimeout(function(){
            this.syncVerticalScroller()
        }.bind(this), 0)
    },


    handleHorizontalScroll: function(event){
        this.props.onScrollLeft(event.target.scrollLeft)
    },
    handleVerticalScroll: function(event){
        this.onVerticalScroll(event.target.scrollTop)
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

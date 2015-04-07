'use strict';

var React  = require('react')
var assign = require('object-assign')
var normalize = require('react-style-normalizer')

var EVENT_NAMES = require('react-event-names')

function copyProps(target, source, list){

    list.forEach(function(name){
        if (name in source){
            target[name] = source[name]
        }
    })

}

module.exports = React.createClass({

    displayName: 'ReactDataGrid.Cell',

    propTypes: {
        className  : React.PropTypes.string,
        textPadding: React.PropTypes.number,
        style      : React.PropTypes.object,
        text       : React.PropTypes.any,
        rowIndex   : React.PropTypes.number
    },

    getDefaultProps: function(){
        return {
            text: '',
            defaultClassName: 'z-cell'
        }
    },

    render: function(){
        var props     = this.props

        var columns   = props.columns
        var index     = props.index
        var column    = columns? columns[index]: null
        var className = props.className || ''
        var text      = props.renderText?
                            props.renderText(props.text, column, props.rowIndex):
                            props.text

        var textCellProps = {
            className: 'z-text',
            style    : {padding: props.textPadding, margin: 'auto 0'}
        }

        var textCell = props.renderCell?
                            props.renderCell(textCellProps, text, props):
                            React.DOM.div(textCellProps, text)

        if (!index){
            className += ' z-first'
        }
        if (columns && index == columns.length - 1){
            className += ' z-last'
        }

        className += ' ' + props.defaultClassName

        var cellProps = {
            className: className,
            style    : normalize(assign({}, props.style, column? column.style: null))
        }

        copyProps(cellProps, props, [
            'onMouseOver',
            'onMouseOut',
            'onClick'
        ].concat([
            EVENT_NAMES.onMouseDown,
            EVENT_NAMES.onMouseUp
        ]))

        // var c = <div className='z-inner' style={props.innerStyle}>
        //             {textCell}
        //         </div>

        var c = textCell

        return (
            <div {...cellProps}>
                {c}
                {props.children}
            </div>
        )
    }
})
'use strict';

var React  = require('react')
var assign = require('object-assign')
var normalize = require('react-style-normalizer')

var EVENT_NAMES = require('react-event-names')

var TEXT_ALIGN_2_JUSTIFY = {
    right: 'flex-end',
    center: 'center'
}

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
        textPadding: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.string
        ]),
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
        var textAlign = column && column.textAlign
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

        if (textAlign){
            className += ' z-align-' + textAlign
        }

        className += ' ' + props.defaultClassName

        var sizeStyle = column && column.sizeStyle
        var cellProps = {
            className: className,
            style    : normalize(assign({}, props.style, sizeStyle))
        }

        copyProps(cellProps, props, [
            'onMouseOver',
            'onMouseOut',
            'onClick'
        ].concat([
            EVENT_NAMES.onMouseDown,
            EVENT_NAMES.onMouseUp
        ]))

        var innerStyle = props.innerStyle

        if (textAlign){
            innerStyle = assign({}, innerStyle, {justifyContent: column.style.justifyContent || TEXT_ALIGN_2_JUSTIFY[column.textAlign]})
        }

        var c = <div className='z-inner' style={innerStyle}>
                    {textCell}
                </div>

        // var c = textCell

        return (
            <div {...cellProps}>
                {c}
                {props.children}
            </div>
        )
    }
})
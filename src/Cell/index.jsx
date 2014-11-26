'use strict';

var React = require('react')

module.exports = React.createClass({

    displayName: 'ReactDataGrid.cell',

    propTypes: {
        className: React.PropTypes.string,
        textPadding: React.PropTypes.number,
        style: React.PropTypes.object,
        text: React.PropTypes.any,
        rowIndex: React.PropTypes.number
    },

    getDefaultProps: function(){
        return {
            text: ''
        }
    },

    render: function(){
        var props     = this.props

        var columns   = props.columns
        var index     = props.index
        var column    = columns[index]
        var className = props.className || ''
        var text      = props.renderText?
                            props.renderText(props.text, column, props.rowIndex):
                            props.text
        var textCellProps = {
            className: 'z-text',
            style    : {padding: props.textPadding}
        }
        var textCell = props.renderCell?
                            props.renderCell(textCellProps, text, props):
                            React.DOM.div(textCellProps, text)

        if (!index){
            className += ' z-first'
        }
        if (index == columns.length - 1){
            className += ' z-last'
        }

        return (
            <div className={className} style={column.style}>
                <div className='z-inner'>
                    {textCell}
                </div>
            </div>
        )
    }
})
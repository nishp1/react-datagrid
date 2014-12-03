'use strict';

var React = require('react')
var renderMenu = require('./renderMenu')
var renderRow  = require('./renderRow')
var tableStyle  = require('./tableStyle')

module.exports = function(props, rows){

    rows = rows || props.data.map(function(data, index){
        return renderRow(props, data, index + props.startIndex)
    })

    return <div ref="table" className="z-table" style={tableStyle(props)}>
        {rows}
        {renderMenu(props)}
    </div>
}
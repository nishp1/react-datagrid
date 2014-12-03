'use strict';

var React = require('react')
var renderMenu = require('./renderMenu')
var renderRow  = require('./renderRow')
var tableStyle  = require('./tableStyle')
var slice  = require('./slice')

function getData(props){

    if (!props.virtualRendering){
        return props.data
    }

    return slice(props.data, props)
}


module.exports = function(props, rows){

    rows = rows || getData(props).map(function(data, index){
        return renderRow(props, data, index + props.startIndex)
    })

    return <div ref="table" className="z-table" style={tableStyle(props)}>
        {rows}
        {renderMenu(props)}
    </div>
}
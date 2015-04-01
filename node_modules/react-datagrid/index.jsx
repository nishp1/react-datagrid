'use strict';

require('./index.styl')

var React = require('react')
var DataGrid = require('./src')

var App = React.createClass({

    render: function(){

        return <DataGrid />
    }
})

React.render((
    <App />
), document.getElementById('content'))
'use strict';

require('./index.styl')

var React  = window.React = require('react')
var Router = require('react-router')
var routes = require('./src/routes')


// Router.run(routes, Router.HistoryLocation, function(Handler){
Router.run(routes, function(Handler){
	React.render(<Handler />, document.getElementById('content'))
});


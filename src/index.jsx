'use strict';

var React     = require('react')
var normalize = require('react-style-normalizer')

var Centered = require('./centered')

var Header = require('./Header')
var Body   = require('./Body')
var Footer = require('./Footer')

window.ReactDataGrid = require('react-datagrid')
window.sorty         = require('sorty')
require('whatwg-fetch') //exposes window.fetch
Object.assign        = require('object-assign')
Object.keys          = Object.keys || require('object-keys')

export default React.createClass({

	displayName: 'DemoIndex',

	render(){
		return <div style={{display: 'flex', flexFlow: 'column', minHeight: '100%'}}>
			<Header />
			<Body />
			<Footer />

		</div>
	}
})
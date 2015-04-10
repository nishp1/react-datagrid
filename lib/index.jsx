'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
'use strict';

var React = require('react');
var normalize = require('react-style-normalizer');

var Centered = require('./centered');

var Header = require('./Header');
var Body = require('./Body');
var Footer = require('./Footer');

var div = React.createElement(
	'div',
	null,
	'test'
);

exports['default'] = React.createClass({

	displayName: 'DemoIndex',

	render: function render() {
		return React.createElement(
			'div',
			{ style: { display: 'flex', flexFlow: 'column', minHeight: '100%' } },
			React.createElement(Header, null),
			React.createElement(
				Centered,
				null,
				React.createElement(Body, null)
			),
			React.createElement(Footer, null)
		);
	}
});
module.exports = exports['default'];
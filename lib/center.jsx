'use strict';

var assign = require('object-assign');

module.exports = function (cmp) {
	cmp.props.style = cmp.props.style || {};

	cmp.props.style = assign({
		maxWidth: 880
	}, cmp.props.style, {
		margin: '0 auto'
	});

	return cmp;
};
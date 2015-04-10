'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _assign = require('object-assign');

var _assign2 = _interopRequireWildcard(_assign);

var _DataGrid = require('react-datagrid');

var _DataGrid2 = _interopRequireWildcard(_DataGrid);

// require('react-datagrid/style/index.styl')

var _data200 = require('./data/200');

var _data2002 = _interopRequireWildcard(_data200);

'use strict';

var columns = [{
	name: 'index',
	title: '#',
	width: 55
}, {
	name: 'firstName'
}, {
	name: 'lastName'
}, {
	name: 'city'
}, {
	name: 'email'
}];

var Body = (function (_React$Component) {
	var _class = function Body() {
		_classCallCheck(this, _class);

		if (_React$Component != null) {
			_React$Component.apply(this, arguments);
		}
	};

	_inherits(_class, _React$Component);

	_createClass(_class, [{
		key: 'render',
		value: function render() {

			var props = this.prepareProps(this.props);

			return _React2['default'].createElement(
				'div',
				props,
				_React2['default'].createElement(_DataGrid2['default'], { idProperty: 'id', data: _data2002['default'], columns: columns, style: { height: 800 } })
			);
		}
	}, {
		key: 'prepareProps',
		value: function prepareProps(thisProps) {

			var props = _assign2['default']({}, thisProps);

			props.style = this.prepareStyle(props);
			props.className = this.prepareClassName(props);

			return props;
		}
	}, {
		key: 'prepareClassName',
		value: function prepareClassName(props) {
			var className = props.className || '';

			return className += ' body';
		}
	}, {
		key: 'prepareStyle',
		value: function prepareStyle(props) {
			var style = _assign2['default']({}, props.defaultStyle, props.style);

			return style;
		}
	}]);

	return _class;
})(_React2['default'].Component);

Body.defaultProps = {
	defaultStyle: {
		flex: 1
	}
};

exports['default'] = Body;
module.exports = exports['default'];
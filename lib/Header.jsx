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

var _Centered = require('./centered');

var _Centered2 = _interopRequireWildcard(_Centered);

'use strict';

var Header = (function (_React$Component) {
	var _class = function Header() {
		_classCallCheck(this, _class);

		if (_React$Component != null) {
			_React$Component.apply(this, arguments);
		}
	};

	_inherits(_class, _React$Component);

	_createClass(_class, [{
		key: 'render',
		value: function render() {
			return _React2['default'].createElement(
				'div',
				this.prepareProps(this.props),
				_React2['default'].createElement(
					_Centered2['default'],
					{ style: {
							width: 'auto', display: 'flex', flexFlow: 'row', alignItems: 'center'
						} },
					_React2['default'].createElement(
						'div',
						null,
						_React2['default'].createElement('img', { src: '../resources/svg/logo-w.svg', style: { height: 35 } }),
						_React2['default'].createElement(
							'p',
							{ style: { padding: '0 20px', fontWeight: 'bold' } },
							'A carefully crafted DataGrid for React'
						)
					)
				)
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
		key: 'prepareStyle',
		value: function prepareStyle(props) {

			var style = _assign2['default']({}, props.defaultStyle, props.style);

			return style;
		}
	}, {
		key: 'prepareClassName',
		value: function prepareClassName(props) {
			var className = props.className || '';

			className += ' header';

			return className;
		}
	}]);

	return _class;
})(_React2['default'].Component);

Header.defaultProps = {
	defaultStyle: {
		boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)'
	}
};

exports['default'] = Header;
module.exports = exports['default'];
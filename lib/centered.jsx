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

'use strict';

function clone(el, props) {
	return _React2['default'].cloneElement(el, props);
}

function center(el) {
	el = el.props ? el : _React2['default'].createElement(
		'div',
		null,
		el
	);

	var style = _assign2['default']({}, el.props.style, this.props.style);

	style.margin = '0 auto';
	style.width = style.width || 960;
	style.minWidth = style.minWidth || 640;

	var props = _assign2['default']({}, this.props);
	props.children = el.props.children;

	props.className = (props.className || '') + ' centered';

	return clone(el, _assign2['default']({}, props, { style: style }));
}

var _default = (function (_React$Component) {
	var _class = function _default() {
		_classCallCheck(this, _class);

		if (_React$Component != null) {
			_React$Component.apply(this, arguments);
		}
	};

	_inherits(_class, _React$Component);

	_createClass(_class, [{
		key: 'render',
		value: function render() {

			var children = this.props.children;

			if (_React2['default'].Children.count(children) <= 1) {
				return center.call(this, children);
			}

			return _React2['default'].Children.map(this.props.children, center, this);
		}
	}]);

	return _class;
})(_React2['default'].Component);

exports['default'] = _default;
module.exports = exports['default'];
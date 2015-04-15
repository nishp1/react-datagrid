'use strict';

var React = require('react')

module.exports = React.createClass({

	displayName: 'Scroller',

	render: function(){

		return React.createElement("div", null, 
			React.createElement("div", React.__spread({ref: "tableWrapper", className: "z-table-wrapper", style: this.props.wrapperStyle},  this.props.events), 
			    this.props.children, 
			    React.createElement("div", {
			    	ref: "verticalScrollbar", 
			    	className: "z-vertical-scrollbar", 
			    	style: {width: this.props.scrollbarSize, position: 'relative'}, 
			    	onScroll: this.handleVerticalScroll, xonWheel: this.handleVerticalWheel}, 
			        React.createElement("div", {className: "z-vertical-scroller", style: {height: this.props.verticalScrollSize}})
			    ), 
			    React.createElement("div", {className: "z-horizontal-scroller", style: {width: this.props.horizontalScrollSize}})
			), 
			React.createElement("div", {ref: "horizontalScrollbar", className: "z-horizontal-scrollbar", onScroll: this.handleHorizontalScroll}, 
			    React.createElement("div", {className: "z-horizontal-scroller", style: {width: this.props.horizontalScrollSize}})
			)
		)
	}
})
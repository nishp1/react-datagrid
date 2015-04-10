'use strict';

import React from 'react'
import assign from 'object-assign'
import normalize from 'react-style-normalizer'

function clone(el, props){
	return React.cloneElement(el, props)
}

function center(el){
	el = el.props? el: <div>{el}</div>

	var style = assign({}, el.props.style, this.props.style)

	style.margin = '0 auto'
	style.width  = style.width || 960
	style.minWidth  = style.minWidth || 640

	var props = assign({}, this.props)
	props.children = el.props.children

	props.className = (props.className || '')  + ' centered'

	if (el.props && el.props.className){
		props.className += ' ' + el.props.className
	}

	return clone(el,
			assign({}, props, {style: normalize(style)})
		)
}

export default class extends React.Component {

	displayName: 'Centered'

	render(){

		var children = this.props.children

		if (React.Children.count(children) <= 1){
			return center.call(this, children)
		}

		return React.Children.map(this.props.children, center, this)
	}
}
'use strict';

import React from 'react'
import assign from 'object-assign'
import { Link, RouteHandler } from 'react-router'

const Body = class extends React.Component {

	render(){

		let props = this.prepareProps(this.props)

		return <div {...props} >
			<div style={{flex: 1}}>
				<RouteHandler />
			</div>
		</div>
	}

	prepareProps(thisProps){

		let props = assign({}, thisProps)

		props.style = this.prepareStyle(props)
		props.className = this.prepareClassName(props)

		return props
	}

	prepareClassName(props){
		let className = props.className || ''

		return className += ' body'
	}

	prepareStyle(props){
		let style = assign({}, props.defaultStyle, props.style)

		return style
	}
}

Body.defaultProps = {
	defaultStyle: {
		flex: 1,
		display: 'flex',
		flexFlow: 'row'
	}
}

export default Body
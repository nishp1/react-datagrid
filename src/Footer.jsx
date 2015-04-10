'use strict';

import React from 'react'
import assign from 'object-assign'
import Centered from './centered'

const logoURL = require('../resources/images/logo-simplu-w.png')

const Footer = class extends React.Component {

	render(){

		var center = !this.context.router.isActive('examples')
		let props = this.prepareProps(this.props)

		return <div {...props}>
			<Centered style={{width: center? null: 'auto'}}>
				<div>
					<img src={logoURL} style={{width: 30, marginRight: 8}} />
					<p><a style={{textDecoration: 'none', color: 'white'}} href="https://github.com/zippyui" target="_blank">© Zippy Technologies</a></p>
				</div>
			</Centered>
		</div>
	}

	prepareProps(thisProps){
		let props = assign({}, thisProps)

		props.className = this.prepareClassName(props)

		return props
	}

	prepareClassName(props){

		let className = props.className || ''

		className += ' footer'

		return className
	}
}

Footer.contextTypes = {
	router: React.PropTypes.func
}

export default Footer
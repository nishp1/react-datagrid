'use strict';

import React from 'react'
import assign from 'object-assign'
import Centered from './centered'

export default class extends React.Component {

	render(){

		let props = this.prepareProps(this.props)
		return <div {...props}>
			<Centered style>
				<div>
					<img src="../resources/svg/logo-simplu-w.svg" style={{width: 30, marginRight: 8}} />
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
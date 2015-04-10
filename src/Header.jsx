'use strict'

import React  from 'react'
import assign from 'object-assign'
import {Link} from 'react-router'
import Centered from './centered'

const gitLogoURL = require('../resources/images/GitHub-Mark-32px.png')
const logoURL = require('../resources/images/logo-simplu-w.png')

const Header = class extends React.Component {

	displayName : 'Header'

	render() {
		return <div {...this.prepareProps(this.props)}>
			<Centered style={{
				xwidth: 'auto', display: 'flex', flexFlow: 'row', alignItems: 'center'
			}}>
				<div>
					<Link to="/" style={{textDecoration: 'none', color: 'white'}}>
						<img src={logoURL} style={{height: 35}}/>
						<span style={{padding: '0 20px', fontSize: '1.2em'}}>
							{'Carefully crafted UI components for React'}
						</span>
					</Link>

					<div style={{flex: 1, textAlign: 'right'}}>
						<div style={{float: 'right'}}>
						<a target="_blank" className="repo-link" href="http://github.com/zippyui/react-datagrid" style={{color: 'white', textDecoration: 'none'}}>
							<img className="github-logo" src={gitLogoURL} />
							GitHub Repo
						</a>
						</div>
					</div>
				</div>
			</Centered>
		</div>
	}

	prepareProps(thisProps){

		let props = assign({}, thisProps)

		props.style = this.prepareStyle(props)
		props.className = this.prepareClassName(props)

		return props
	}

	prepareStyle(props){

		let style = assign({}, props.defaultStyle, props.style)

		return style
	}

	prepareClassName(props){
		let className = props.className || ''

		className += ' header'

		return className
	}
}

Header.defaultProps = {
		defaultStyle: {
			boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)'
		}
	}

export default Header
'use strict';

import React from 'react'
import assign from 'object-assign'
import Centered from './centered'
import ReactButton from 'react-button'
import SvgIcon from './utils/SvgIcon'

let backgroundURL = require('../resources/images/bkg-pattern.png')

function toStyle(...args){
	var target = {}

	args.forEach(function(a){
		assign(target, a)
	})

	return target
}

let gridLogo  = require('../resources/svg/grid-logo.svg')
let TURQUOISE = '#8CC9DD'
let GRAY      = '#494E4F'

let theme = {
	style: {
		background: 'transparent',
		color: GRAY,
		border: '3px solid white',
		padding: '10px 20px',
		fontWeight: 'bold'
	},
	overStyle: {
		background: 'white'
	}
}

let box = {
	flex: 1,
	border: '2px solid ' + TURQUOISE,
	marginLeft: 20,
	padding: 20,
	color: GRAY
}

class Button extends React.Component {
	render(){
		return <ReactButton theme={theme} applyDefaultTheme={false} {...this.props}/>
	}
}

class Box extends React.Component {
	render(){
		var props = assign({}, this.props)

		var children = []

		React.Children.forEach(props.children, function(child){
			children.push(child)
		})

		var title = children[0]
		var body = children[1]

		props.className = (props.className || '') + ' feature-box'
		props.style = toStyle(box, props.style, { display: 'flex', flexFlow: 'column', justifyContent: 'space-between'})

		return <div {...props}>
			<h3 style={{textTransform: 'uppercase'}}>{title}</h3>
			<div style={{lineHeight: '1.8em'}} >{body}</div>
			<Button style={{background: TURQUOISE, alignSelf: 'flex-end'}} href={props.href}>{this.props.linkText || 'See demo'}</Button>
		</div>
	}
}

const STRIP_PADDING = '30px 10px'
const Content = class extends React.Component {

	render(){

		return <div className="content">

				<div style={{padding: STRIP_PADDING, display: 'flex', flexFlow: 'column', justifyContent: 'center', color: 'white', background: 'url("' + backgroundURL + '")'}}>
					<Centered style={{display: 'block'}}>
						<div>
							<h2 style={{marginTop: 0}}>{'A carefully crafted DataGrid for React'}</h2>
							<p>
								<SvgIcon svg={gridLogo} style={{verticalAlign: 'middle', display: 'inline-block', marginRight: 20}}/>
								<code style={{fontSize: '1.5em'}}>$ npm install react-datagrid --save </code>
							</p>
							<Button className="demo-button" href={this.context.router.makeHref('examples', {name: 'basic'})}>
								SHOW DEMO
							</Button>
							<Button style={{marginLeft: 30}} className="demo-button" href="https://github.com/zippyui/react-datagrid/blob/master/README.md">
								SEE README DOCS
							</Button>
						</div>
					</Centered>
				</div>

				<div style={{padding: STRIP_PADDING}}>
					<Centered>
						<div style={{display: 'flex', flexFlow: 'row', alignItems: 'stretch'}}>
							<Box style={{marginLeft: 0}} linkText="Show me a proof" href={this.context.router.makeHref('examples', {name: 'large-data-array'})}>
								<span>zippy performance</span>
								<div>
									<p>Performance stays the same, no matter how many records you have in the grid.</p>
									<p>You can start small or end-up with a million records, the grid will remain snappy!</p>
								</div>
							</Box>

							<Box  href={this.context.router.makeHref('examples', {name: 'sorting'})}>
								<span>production ready</span>
								<div>
									<p>The grid comes with a lot of functionality built-in.</p>
									<p>No need to look further to support for sorting/filtering/selection/column reordering, etc</p>
								</div>
							</Box>

							<Box linkText='Show customized example'  href={this.context.router.makeHref('examples', {name: 'custom-row-styling'})}>
								<span>customizable</span>
								<div>
									<p>Basically you can customize everything.</p>
									<p>Start with changing how cell contents are rendered, what styles are applied or totally modifying how selection behaves</p>
								</div>
							</Box>
						</div>
					</Centered>
				</div>

				<div style={{padding: STRIP_PADDING, display: 'flex', flexFlow: 'column', justifyContent: 'center', color: 'white', background: 'url("' + backgroundURL + '")'}} className="strip background">
					<Centered style={{display: 'block'}}>
						<div>
							<h2 style={{marginTop: 0}}>Built on top of React, published on NPM</h2>

							<p style={{fontSize: '1.5em'}}>
								Just run
							</p>
							<p style={{fontSize: '1.5em'}}>
								<code>$ npm install react-datagrid --save </code>
							</p>
							<p style={{fontSize: '1.5em'}}>
								and you are ready to use
							</p>
							<Button className="demo-button" href={this.context.router.makeHref('examples', {name: 'basic'})}>
								SEE LIVE EXAMPLES
							</Button>
						</div>
					</Centered>
				</div>

			</div>
	}
}

Content.contextTypes = {
	router: React.PropTypes.func
}


export default Content
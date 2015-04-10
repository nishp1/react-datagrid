'use strict';

import React from 'react'
import menu from './examplesMenu'
import { map as examples} from './examples'
import { RouteHandler } from 'react-router'

const Examples = class extends React.Component {

	render(){
		var exampleName = this.context.router.getCurrentParams().name || 'basic'
		var Cmp = examples[exampleName]
		var content

		if (!Cmp){
			content = <b>Sorry, example not found</b>
		} else {
			content = <Cmp />
		}

		return <div style={{display: 'flex', marginBottom: 10, marginRight: 10}}>
			<div style={{paddingTop: 20, paddingLeft: 20}}>{menu()}</div>
			<div style={{flex: 1}}>
				{content}
			</div>

		</div>
	}
}

Examples.contextTypes = {
	router: React.PropTypes.func
}

Examples.displayName = 'Examples'

export default Examples
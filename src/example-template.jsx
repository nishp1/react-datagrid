'use strict';

import React from 'react'
import Snippet from './Snippet'

export default function(name, snippetProps){

	snippetProps = snippetProps || {}

	function req(){
		return require('babel-loader!./examples/' + name + '.example')
	}

	return React.createClass({

		name: name,

		displayName: 'example_' + name,

		getInitialState: function(){
			return {
				props: {}
			}
		},

		render: function(){

			var cmp  = React.cloneElement(this.state.cmp || req())
			var code = require('raw-loader!../src/examples/' + name + '.example')

			var description

			if (snippetProps.description){
				description = <p>{snippetProps.description}</p>
			}

			return <div style={{marginTop: 20}}>
				{description}
				<div>{cmp}</div>
				<Snippet {...snippetProps}
					code={code}
					updateCmp={this.updateCmp}
				/>
			</div>
		},

		updateCmp: function(cmp) {
			this.setState({
				cmp: cmp
			})
		}
	})

}
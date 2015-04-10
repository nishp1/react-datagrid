'use strict';

var data = window.__DATA = {}

import React from 'react'
import assign from 'object-assign'
import CodeMirror from './utils/CodeMirrorEditor'
import buffer from 'buffer-function'

require('codemirror/mode/javascript/javascript')

var req = require.context("./data", true, /^\.\/.*\.js$/)
var prev = Date.now()

req.keys().forEach(function(key){
	var newKey = key.replace('./','../data/')
	newKey = newKey.replace('.js','')

	var value = req(key)
	data[newKey] = value
})

function emptyFn(){}

var prefix = `
;var require = (function(){
	var MAP = Object.assign({
		react: window.React,
		'react-datagrid': window.ReactDataGrid,
		sorty: window.sorty,
		fetch: window.fetch
	}, __DATA)

	return function(path){
		var res = MAP[path] || window[path]

		if (!res){
			throw 'Module "' + path + '" not found. Please use one of the following: "' + Object.keys(MAP).join('", "') + '".'
		}

		return res
	}

})();
; var module = {
	exports: null
};
`

var suffix = `
return module.exports
`

const Snippet = React.createClass({

	getInitialState: function(){
		return {
			code: this.props.code
		}
	},

	getDefaultProps: function(){
		return {
			transformer: function(code) {
				return JSXTransformer.transform(code).code
			}
		}
	},

	render: function(){

		let props = this.prepareProps(this.props)

		return <div {...props} />
	},

	prepareProps: function(thisProps){
		let props = assign({}, thisProps)

		props.className = this.prepareClassName(props)
		props.children = this.prepareChildren(props)

		return props
	},

	prepareChildren: function(props){

		let children = []

		React.Children.forEach(props.children, function(child){
			children.push(child)
		})

		var code = this.state.code
		var err = this.state.err
		var border = err? '1px solid rgb(255, 89, 89)': '1px solid gray'

		let editor = <CodeMirror
				key="code"
				ref="editor"
				className="react-code-mirror"
				lineNumbers={true}
				value={code}
				style={{border: border}}
				height={props.height}
				codeText={code}
				onChange={this.handleChange}
				>
			</CodeMirror>

		children.push(editor)

		if (err){
			children.push(<div className="editor-error">{err}</div>)
		}

		return children
	},

	handleChange: function(code){
		this.setState({code: code})
	},

	prepareClassName: function(props){
		let className = props.className || ''

		className += 'snippet'

		return className
	},

	compileCode: function() {
		return this.props.transformer(this.state.code)
	},

	componentDidMount: function(){
		this.executeCode = buffer(this.executeCode, 300)
	},

	componentDidUpdate: function(prevProps, prevState) {
	  // execute code only when the state's not being updated by switching tab
	  // this avoids re-displaying the error, which comes after a certain delay
	  if (this.props.transformer !== prevProps.transformer ||
	      this.state.code !== prevState.code) {
	  		this.executeCode()
	  }
	},

	executeCode: function() {

	  	try {
	    	var compiledCode = this.compileCode()

	    	compiledCode = prefix + compiledCode + suffix

	    	var fn = new Function(compiledCode)
	    	var cmp = fn()

	    	this.setState({
	    		err: null
	    	})

	    	;(this.props.updateCmp || emptyFn)(cmp)
	  	} catch (err) {
	    	this.setState({
	    		err: err.toString()
	    	})
	  	}

	  	prev = Date.now()
	}
})

export default Snippet
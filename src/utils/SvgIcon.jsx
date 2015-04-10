'use strict'

import React from 'react'
import assign from 'object-assign'

function getSvgBody(svg) {
  return svg
    .replace('module.exports = ','')
    // remove xml prolog
    .replace(/<\?xml[\s\S]*?>/gi, "")
    // remove doctype
    .replace(/<!doctype[\s\S]*?>/gi, "")
    // remove comments
    .replace(/<!--[\s\S]*?-->/g, "")
    // remove hardcoded dimensions
    // .replace(/width="\d+(\.\d+)?(px)?"/gi, "")
    // .replace(/height="\d+(\.\d+)?(px)?"/gi, "")
    .trim()
}

export default React.createClass({
  propTypes: {
    svg: React.PropTypes.string.isRequired,
    id: React.PropTypes.string,
    modifier: React.PropTypes.string,
    color: React.PropTypes.string
  },

  render() {

    var props = assign({}, this.props)
    var svg = props.svg

    if (!svg.trim().match(/^\s*</g)) {
      console.warn("Please use <IconSvg> with <svg> file. props= " + JSON.stringify(props))
    }

    var style = assign({}, props.style)
    if (props.color) {
      style.fill = 'red'//props.color
    }
    if (props.size) {
      style.fontSize = props.size
    }

    return (
      <span
        {...props}
        dangerouslySetInnerHTML={{__html: getSvgBody(svg)}}>
      </span>
    )
  }
})
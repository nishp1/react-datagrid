'use strict';

var normalize = require('react-style-normalizer')

module.exports = function(props){
    var scrollTop  = props.virtualRendering?
                        -(props.topOffset || 0):
                        props.scrollTop

    return normalize({
        transform: 'translate3d(' + -props.scrollLeft + 'px, ' + -scrollTop + 'px, 0px)'
    })
}

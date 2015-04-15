'use strict';

var normalize = require('react-style-normalizer')

var colors = [
	'blue',
	'red',
	'magenta'
]
module.exports = function(props){
    var scrollTop  = props.virtualRendering?
                        -(props.topOffset || 0):
                        props.scrollTop

    return normalize({
        transform: 'translate3d(' + -props.scrollLeft + 'px, ' + -scrollTop + 'px, 0px)',

        //needed for FF - see
        //http://stackoverflow.com/questions/27424831/firefox-flexbox-overflow
        //http://stackoverflow.com/questions/27472595/firefox-34-ignoring-max-width-for-flexbox
        maxWidth: 'calc(100% - ' + props.scrollbarSize + 'px)',

    })
}

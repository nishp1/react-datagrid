'use strict';

module.exports = function(props){
    var scrollTop  = props.virtualRendering?
                        0:
                        props.scrollTop

    return {
        transform: 'translate3d(' + -props.scrollLeft + 'px, ' + -scrollTop + 'px, 0px)'
    }
}

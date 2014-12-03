'use strict';

module.exports = function renderMenu(props){
    if (!props.menuColumn){
        return
    }

    var style  = {top: 0}
    var offset = props.menuOffset

    if (offset.left){
        style.left = offset.left + props.scrollLeft
    } else {
        style.right = offset.right - props.scrollLeft - props.scrollbarSize
    }

    return props.menu({
        style    : style,
        className: 'z-header-menu-column'
    })
}
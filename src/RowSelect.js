'use strict';

var getSelected = require('./getSelected')

module.exports = {

    handleSelection: function(rowProps, event){

        var isSelected  = this.isRowSelected(rowProps.data)
        var multiSelect = this.isMultiSelect()
        var prevIndex   = this.lastClickIndex

        if (!multiSelect || prevIndex == null || (isSelected && event.ctrlKey)){
            this.toggleRowSelect(rowProps.data, event)
            this.lastClickIndex = rowProps.index
        } else {
            var index = rowProps.index
            var start = Math.min(index, prevIndex) + 1
            var end = Math.max(index, prevIndex) + 1

            var data = this.props.data.slice(start, end)

            data.forEach(function(item){
                this.toggleRowSelect(item)
            }, this)

            this.lastClickIndex = null
        }

    },


    isRowSelected: function(data){
        var selectedMap = this.getSelectedMap()
        var id          = data[this.props.idProperty]

        return selectedMap[id]
    },

    isMultiSelect: function(){
        var selected = getSelected(this.props, this.state)

        return selected && typeof selected == 'object'
    },

    getSelectedMap: function(){
        var selected    = getSelected(this.props, this.state)
        var multiSelect = selected && typeof selected == 'object'
        var map

        if (multiSelect){
            map = selected
        } else {
            map = {}
            map[selected] = true
        }

        return map
    },

    toggleRowSelect: function(data, event){

        var props = this.props

        var rowSelected = this.isRowSelected(data)
        var newSelected = !rowSelected

        if (rowSelected && event && !event.ctrlKey){
            //if already selected and not ctrl, keep selected
            newSelected = true
        }

        if (typeof props.onSelectionChange == 'function'){
            props.onSelectionChange(newSelected, data)
        }

        if (props.selected == null){
            //we have a value in defaultSelected
            this.setRowSelected(newSelected, data)
        }
    },

    setRowSelected: function(rowSelected, data){
        var selected    = getSelected(this.props, this.state)
        var multiSelect = selected && typeof selected == 'object'
        var id = data[this.props.idProperty]

        if (multiSelect){
            if (!rowSelected){
                delete selected[id]
            } else {
                selected[id] = data
            }
        } else {
            selected = rowSelected? id: null
        }

        this.setState({
            defaultSelected: selected
        })
    }
}
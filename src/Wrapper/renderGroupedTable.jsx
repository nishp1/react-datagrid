'use strict';

var React = require('react')

var Row         = require('../Row')
var Cell        = require('../Cell')
var CellFactory = React.createFactory(Cell)

var renderRow   = require('./renderRow')
var renderTable = require('./renderTable')

function renderData(props, data, depth){

    return data.map(function(data, index){

        return renderRow(props, data, index, function(config){
            config.cellFactory = function(cellProps){
                if (cellProps.index === 0){
                    cellProps.innerStyle = {
                        paddingLeft: depth * props.groupNestingWidth
                    }
                }

                return CellFactory(cellProps)
            }

            config.className += ' z-grouped'

            return config
        })
    })
}

function renderGroupRow(props, groupData){

    var style = {
        paddingLeft: (groupData.depth - 1)* props.groupNestingWidth
    }

    var cellStyle = {
        minWidth: props.totalColumnWidth,
        maxWidth: props.totalColumnWidth
    }

    return <Row className='z-group-row' key={groupData.namePath} rowHeight={props.rowHeight}>
        <Cell
            className='z-group-cell'
            textPadding={props.cellPadding}
            innerStyle={style}
            text={groupData.value}
            style={cellStyle}
        />
    </Row>
}

function renderGroup(props, groupData, counter){

    if (counter){
        counter.length++
    }

    var result
    if (groupData && groupData.leaf){
        result = renderData(props, groupData.data, groupData.depth)
    } else {
        result = groupData.keys.map(key => renderGroup(props, groupData.data[key], counter))
    }

    result.unshift(renderGroupRow(props, groupData))

    return result
}

function renderGroups(props, groupsData, counter){
    return groupsData.keys.map(key => renderGroup(props, groupsData.data[key], counter))
}

module.exports = function(props, counter){

    return renderTable(props, renderGroups(props, props.groupData, counter))
}
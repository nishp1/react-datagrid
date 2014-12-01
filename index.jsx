'use strict';

require('./index.styl')

var sorty = require('sorty')
var React = require('react')
var DataGrid = require('./src')
var faker = require('faker');

var gen = (function(){

    var cache = {}

    return function(len){

        if (cache[len]){
            return cache[len]
        }

        var arr = []

        for (var i = 0; i < len; i++){
            arr.push({
                id       : i + 1,
                grade      : Math.round(Math.random() * 10),
                email    : faker.internet.email(),
                firstName: faker.name.firstName(),
                lastName : faker.name.lastName(),
                birthDate: faker.date.past()
            })
        }

        cache[len] = arr

        return arr
    }
})()

var columns = [
    {
        name: 'id'
    },
    {
        name: 'grade',
        // hidden: true,
        sortable: false
    },
    {
        name: 'firstName',
        width: 200
    },
    {
        name: 'lastName',
        width: 400
    }
]

var ROW_HEIGHT = 31
var LEN = 100
var SORT_INFO = [ { name: 'firstName', dir: 'asc' } ]
var data

function sort(SORT_INFO, arr){

}

var App = React.createClass({

    handleChange: function(event){
        ROW_HEIGHT = event.target.value
        this.setState({})
    },

    handleDataLenChange: function(event){
        LEN = event.target.value
        this.setState({})
    },

    handleSortChange: function(sortInfo){
        SORT_INFO = sortInfo
        this.setState({})
    },

    onColumnChange: function(column, visible){
        column.hidden = !visible

        this.setState({})
    },

    render: function(){
        var sort = sorty(SORT_INFO)

        console.time('gen')

        data = window.data = sort(gen(LEN))

        console.timeEnd('gen')

        return <div >
            <input value={ROW_HEIGHT} onChange={this.handleChange} />
            <input value={LEN} onChange={this.handleDataLenChange} />

            <DataGrid
                onColumnVisibilityChange={this.onColumnChange}
                sortInfo={SORT_INFO} onSortChange={this.handleSortChange} scrollBy={5} virtualRendering={true} idProperty='id' style={{border: '1px solid gray', height: 800}} rowHeight={ROW_HEIGHT} showCellBorders={true} data={data} columns={columns}/>
        </div>

    }
})

React.render((
    <App />
), document.getElementById('content'))
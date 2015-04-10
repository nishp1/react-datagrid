'use strict';

require('./index.styl')

var sorty = require('sorty')
var React = require('react')
var DataGrid = require('./src')
var faker = window.faker = require('faker');

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
                birthDate: faker.date.past(),
                country  : faker.address.country(),
                city  : faker.address.city()
            })
        }

        cache[len] = arr

        return arr
    }
})()

var columns = [
    {
        name: 'country',
        style: {
            color: 'red',
            textAlign: 'right'
        }
    },
    {
        name: 'id',
        filterable: false,
        type: 'number'
    },
    {
        name: 'grade',
        type: 'number',
        title: <span>a grade</span>
    },
    {
        name: 'email',
        minWidth: 100
    },
    {
        name: 'lastName',
        minWidth: 100
    }
]

var ROW_HEIGHT = 31
var LEN = 1000
var SORT_INFO = []//[ { name: 'id', dir: 'asc'} ]
var sort = sorty(SORT_INFO)
var data = gen(LEN) //= [{"firstName":"Elvis","lastName":"Beatty","phoneNumber":"(146)716-9131","id":0,"city":"Liverpool","country":"UK","continent":"Europe","age":24},{"firstName":"Ettie","lastName":"Conroy","phoneNumber":"1-138-484-3095 x667","id":1,"city":"Liverpool","country":"UK","continent":"Europe","age":20,"meta":{}},{"firstName":"Clarissa","lastName":"Dibbert","phoneNumber":"107.824.7117","id":2,"city":"Bucharest","country":"Romania","continent":"Europe","age":17},{"firstName":"Jordan","lastName":"Zboncak","phoneNumber":"1-221-287-1599","id":3,"city":"London","country":"UK","continent":"Europe","age":22,"meta":{}},{"firstName":"Jordy","lastName":"Blanda","phoneNumber":"1-047-392-3287 x246","id":4,"city":"New York","country":"USA","continent":"North America","age":17},{"firstName":"Sabrina","lastName":"Jacobson","phoneNumber":"1-405-138-6096","id":5,"city":"Montreal","country":"Canada","continent":"North America","age":26},{"firstName":"Gabriella","lastName":"Satterfield","phoneNumber":"849.103.0436 x658","id":6,"city":"Venice","country":"Italy","continent":"Europe","age":23},{"firstName":"Verda","lastName":"Baumbach","phoneNumber":"(627)204-6071","id":7,"city":"Liverpool","country":"UK","continent":"Europe","age":18},{"firstName":"Dina","lastName":"Stracke","phoneNumber":"642.379.7692","id":8,"city":"Bucharest","country":"Romania","continent":"Europe","age":24},{"firstName":"Demario","lastName":"Robel","phoneNumber":"076-254-9908","id":9,"city":"Rome","country":"Italy","continent":"Europe","age":12},{"firstName":"Sandy","lastName":"Connelly","phoneNumber":"(540)836-4371 x58842","id":10,"city":"Rome","country":"Italy","continent":"Europe","age":28},{"firstName":"Meredith","lastName":"Kuphal","phoneNumber":"(102)968-9882 x2140","id":11,"city":"New York","country":"USA","continent":"North America","age":19},{"firstName":"London","lastName":"Huel","phoneNumber":"1-913-882-4767 x5581","id":12,"city":"Montreal","country":"Canada","continent":"North America","age":23},{"firstName":"Elbert","lastName":"Weber","phoneNumber":"(572)250-9164 x7932","id":13,"city":"Venice","country":"Italy","continent":"Europe","age":25},{"firstName":"Lexi","lastName":"Fritsch","phoneNumber":"930-022-8501 x0890","id":14,"city":"Venice","country":"Italy","continent":"Europe","age":24},{"firstName":"Delbert","lastName":"Mayer","phoneNumber":"(493)804-3393 x78756","id":15,"city":"New York","country":"USA","continent":"North America","age":30},{"firstName":"Lura","lastName":"Kuhic","phoneNumber":"(809)665-8916 x887","id":16,"city":"Liverpool","country":"UK","continent":"Europe","age":12},{"firstName":"Pinkie","lastName":"Toy","phoneNumber":"912-101-1800","id":17,"city":"New York","country":"USA","continent":"North America","age":15},{"firstName":"Jensen","lastName":"Erdman","phoneNumber":"(012)163-8998 x5098","id":18,"city":"Rome","country":"Italy","continent":"Europe","age":10},{"firstName":"Sid","lastName":"Gorczany","phoneNumber":"357.734.7163 x733","id":19,"city":"Venice","country":"Italy","continent":"Europe","age":18},{"firstName":"Will","lastName":"Huel","phoneNumber":"1-881-607-2703","id":20,"city":"London","country":"UK","continent":"Europe","age":25},{"firstName":"Judah","lastName":"Casper","phoneNumber":"(729)911-4999","id":21,"city":"Venice","country":"Italy","continent":"Europe","age":15},{"firstName":"Maida","lastName":"Beahan","phoneNumber":"593-564-7375 x62342","id":22,"city":"London","country":"UK","continent":"Europe","age":27},{"firstName":"Darian","lastName":"Okuneva","phoneNumber":"933-999-5152 x569","id":23,"city":"Rome","country":"Italy","continent":"Europe","age":27},{"firstName":"Dejon","lastName":"Runte","phoneNumber":"298-254-8872","id":24,"city":"Bucharest","country":"Romania","continent":"Europe","age":16},{"firstName":"Treva","lastName":"Schinner","phoneNumber":"1-470-433-1485 x09727","id":25,"city":"Rome","country":"Italy","continent":"Europe","age":18},{"firstName":"Maeve","lastName":"Nader","phoneNumber":"381.315.6499 x559","id":26,"city":"Rome","country":"Italy","continent":"Europe","age":23},{"firstName":"Christiana","lastName":"Predovic","phoneNumber":"(903)542-9311 x0918","id":27,"city":"Rome","country":"Italy","continent":"Europe","age":19},{"firstName":"Talia","lastName":"Mann","phoneNumber":"(751)277-4542 x06059","id":28,"city":"Montreal","country":"Canada","continent":"North America","age":24},{"firstName":"Pearline","lastName":"Lindgren","phoneNumber":"1-658-571-7728 x00128","id":29,"city":"Venice","country":"Italy","continent":"Europe","age":21},{"firstName":"Loy","lastName":"Pouros","phoneNumber":"1-961-380-4009 x20700","id":30,"city":"Rome","country":"Italy","continent":"Europe","age":26},{"firstName":"Joanie","lastName":"Renner","phoneNumber":"1-125-904-1019 x3917","id":31,"city":"New York","country":"USA","continent":"North America","age":27},{"firstName":"Jacky","lastName":"Zieme","phoneNumber":"1-816-707-5056 x8663","id":32,"city":"Venice","country":"Italy","continent":"Europe","age":11},{"firstName":"Lonzo","lastName":"Hackett","phoneNumber":"772-946-4770 x4643","id":33,"city":"London","country":"UK","continent":"Europe","age":27},{"firstName":"Letha","lastName":"Renner","phoneNumber":"969-564-8900","id":34,"city":"Liverpool","country":"UK","continent":"Europe","age":27},{"firstName":"Celia","lastName":"Hayes","phoneNumber":"(509)692-9168","id":35,"city":"Bucharest","country":"Romania","continent":"Europe","age":29},{"firstName":"Lonny","lastName":"Bashirian","phoneNumber":"1-971-697-2678 x015","id":36,"city":"Montreal","country":"Canada","continent":"North America","age":17},{"firstName":"Scarlett","lastName":"Schroeder","phoneNumber":"1-513-253-9292 x1955","id":37,"city":"Venice","country":"Italy","continent":"Europe","age":21},{"firstName":"Alford","lastName":"Tremblay","phoneNumber":"611-233-6301 x6399","id":38,"city":"New York","country":"USA","continent":"North America","age":25},{"firstName":"Grayson","lastName":"Batz","phoneNumber":"1-759-680-1417","id":39,"city":"London","country":"UK","continent":"Europe","age":13},{"firstName":"Skyla","lastName":"McLaughlin","phoneNumber":"(833)437-3068","id":40,"city":"Montreal","country":"Canada","continent":"North America","age":22},{"firstName":"Sarah","lastName":"Runolfsdottir","phoneNumber":"686.672.8906 x990","id":41,"city":"Rome","country":"Italy","continent":"Europe","age":10},{"firstName":"Angelita","lastName":"Nienow","phoneNumber":"(559)990-0517 x7324","id":42,"city":"Montreal","country":"Canada","continent":"North America","age":12},{"firstName":"Jocelyn","lastName":"Heller","phoneNumber":"251-600-7625 x68634","id":43,"city":"New York","country":"USA","continent":"North America","age":19},{"firstName":"Patsy","lastName":"Marks","phoneNumber":"715-409-9601 x0648","id":44,"city":"New York","country":"USA","continent":"North America","age":17},{"firstName":"Clarabelle","lastName":"Hayes","phoneNumber":"850.646.8951","id":45,"city":"Bucharest","country":"Romania","continent":"Europe","age":13},{"firstName":"Tatum","lastName":"Bradtke","phoneNumber":"106-783-6434","id":46,"city":"New York","country":"USA","continent":"North America","age":17},{"firstName":"Kaci","lastName":"Pfeffer","phoneNumber":"846-929-8251","id":47,"city":"Venice","country":"Italy","continent":"Europe","age":28},{"firstName":"Rey","lastName":"Rutherford","phoneNumber":"503-412-0979 x06685","id":48,"city":"New York","country":"USA","continent":"North America","age":11},{"firstName":"Buck","lastName":"Sauer","phoneNumber":"470.498.6970","id":49,"city":"London","country":"UK","continent":"Europe","age":24}]
var origData = [].concat(data)

var selected = { 1153: true }
var App = React.createClass({


    handleSortChange: function(sortInfo){
        SORT_INFO = sortInfo
        // debugger
        console.log('SORT', sortInfo)
        this.setState({})
    },

    onColumnChange: function(column, visible){
        column.hidden = !visible

        this.setState({})
    },

    onColumnOrderChange: function(index, dropIndex){
        var col = columns[index]
        columns.splice(index, 1) //delete from index, 1 item
        columns.splice(dropIndex, 0, col)
        this.setState({})
    },

    onColumnResize: function(firstCol, firstSize, secondCol, secondSize){
        firstCol.width = firstCol.minWidth = firstSize

        if (secondCol){
            secondCol.width = secondCol.minWidth = secondSize
        }

        this.setState({})
    },

    render: function(){
        var sort = sorty(SORT_INFO)

        data = sort(origData)

        var groupBy = ['grade','country']

        function rowStyle(data, props){
            var style = {}
            if (props.index % 4 == 0){
                style.color = 'blue'
                // props.selected = true
            }
            return style
        }

        function blue(data, props){
            if (props.index % 4 == 0){
                return 'blue'
            }
        }

        function f(props){
            return <div {...props} />
        }

        var filter = function(column, value, values){
            console.log('filter for ' + column.name + ' = ', value, values)

            value = value.toUpperCase()

            if (!value){
                data = [].concat(origData)
            } else {

                data = origData.filter(function(item){
                    if (item[column.name].toUpperCase().indexOf(value) === 0){
                        return true
                    }
                })
            }

            this.setState({})
        }.bind(this)

        var clearFilter = function(){
            data = [].concat(origData)

            this.setState({})
        }.bind(this)

        var onSelectionChange = function(sel, data){
            selected = sel
            this.setState({})
        }.bind(this)


        return <div >

            <DataGrid
                onFilter={filter}
                liveFilter={true}
                defaultSelected={selected}
                xonSelectionChange={onSelectionChange}
                onColumnVisibilityChange={this.onColumnChange}
                onColumnOrderChange={this.onColumnOrderChange}
                onColumnResize={this.onColumnResize}
                sortInfo={SORT_INFO}
                xgroupBy={groupBy}
                rowStyle={rowStyle}
                rowClassName={blue}
                xrowFactory={f}
                onSortChange={this.handleSortChange}
                xscrollBy={5}
                idProperty='id'
                style={{border: '1px solid gray', height: 900}}
                showCellBorders={true}
                rowHeight={ROW_HEIGHT}
                virtualRendering={true}
                emptyText='testing'
                cellPadding={'0px 5px'}
                data={data} columns={columns}/>

        </div>

    }
})

React.render((
    <App />
), document.getElementById('content'))
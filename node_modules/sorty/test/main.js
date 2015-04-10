describe('test all', function(){

    var sorty = require('../index')

    it('should sort simple array', function(){
        var arr = [
            {name: 'john', age: 20},
            {name: 'mary', age: 10},
            {name: 'bill', age: 40},
            {name: 'john', age: 100}
        ]

        sorty([
            {name: 'name', dir: 'asc'},
            {name: 'age',  dir: 'desc', type: 'number'}
        ], arr)

        arr.should.eql([
            {name: 'bill', age: 40},
            {name: 'john', age: 100},
            {name: 'john', age: 20},
            {name: 'mary', age: 10}
        ])
    })

    it('should sort with custom fn', function(){
        var arr = [
            { age: '5', name: 'mary'},
            { age: '5', name: 'bob'},
            { age: '15', name: 'monica'},
            { age: '15', name: 'adam'}
        ]

        sorty([
            {name: 'age', fn: function(a, b){ return a*1 - b * 1}, dir: 'desc' },
            {name: 'name', dir: 'asc'}
        ], arr)

        arr.should.eql([
            { age: '15', name: 'adam'},
            { age: '15', name: 'monica'},
            { age: '5', name: 'bob'},
            { age: '5', name: 'mary'}
        ])
    })

    it('should sort with curried fn', function(){
        var arr = [
            { age: '5', name: 'mary'},
            { age: '5', name: 'bob'},
            { age: '15', name: 'monica'},
            { age: '15', name: 'adam'}
        ]

        var sort = sorty([
            {name: 'age', fn: function(a, b){ return a*1 - b * 1}, dir: 'desc' },
            {name: 'name', dir: 'asc'}
        ])

        sort(arr)

        arr.should.eql([
            { age: '15', name: 'adam'},
            { age: '15', name: 'monica'},
            { age: '5', name: 'bob'},
            { age: '5', name: 'mary'}
        ])
    })

    it('should sort with sorty.getFunction', function(){
        var arr = [
            { age: '5', name: 'mary'},
            { age: '5', name: 'bob'},
            { age: '15', name: 'monica'},
            { age: '15', name: 'adam'}
        ]

        var fn = sorty.getFunction([
            {name: 'age', fn: function(a, b){ return a*1 - b * 1}, dir: 'desc' },
            {name: 'name', dir: 'asc'}
        ])

        arr.sort(fn)

        arr.should.eql([
            { age: '15', name: 'adam'},
            { age: '15', name: 'monica'},
            { age: '5', name: 'bob'},
            { age: '5', name: 'mary'}
        ])
    })

    it('should sort with sort info as object', function(){
        var arr = [
            { age: '5', name: 'mary'},
            { age: '5', name: 'bob'},
            { age: '15', name: 'monica'},
            { age: '15', name: 'adam'}
        ]

        sorty(
            {name: 'name', dir: 'asc'}
        , arr)

        arr.should.eql([
            { age: '15', name: 'adam'},
            { age: '5', name: 'bob'},
            { age: '5', name: 'mary'},
            { age: '15', name: 'monica'}
        ])
    })

    it('should do nothing on no sort info', function(){
        var arr = [
            { age: '5', name: 'mary'},
            { age: '5', name: 'bob'},
            { age: '15', name: 'monica'},
            { age: '15', name: 'adam'}
        ]

        sorty(null, arr)

        arr.should.eql([
            { age: '5', name: 'mary'},
            { age: '5', name: 'bob'},
            { age: '15', name: 'monica'},
            { age: '15', name: 'adam'}
        ])
    })

    it('should do nothing on dir=0', function(){
        var arr = [
            { age: '5', name: 'mary'},
            { age: '5', name: 'bob'},
            { age: '15', name: 'monica'},
            { age: '15', name: 'adam'}
        ]

        sorty([{ name: 'age', dir: 0}], arr)

        arr.should.eql([
            { age: '5', name: 'mary'},
            { age: '5', name: 'bob'},
            { age: '15', name: 'monica'},
            { age: '15', name: 'adam'}
        ])

        sorty._getSortFunctions([{ name: 'age', dir: 0}, {name: 'name', dir: -2 }])
            .length
            .should
            .equal(1)
    })

    it('should skip sort dir with 0', function(){
        var arr = [
            { age: '5', name: 'mary'},
            { age: '5', name: 'bob'},
            { age: '15', name: 'monica'},
            { age: '15', name: 'adam'}
        ]

        sorty([
            {name: 'age', dir: 0 },
            {name: 'name', dir: 1}
        ], arr)
        //will sort only by name, asc

        arr.should.eql([
            { age: '15', name: 'adam'},
            { age: '5', name: 'bob'},
            { age: '5', name: 'mary'},
            { age: '15', name: 'monica'}
        ])
    })

})
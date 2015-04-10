sorty
=====

> Sort object arrays on multiple properties with ease.

## Install

```sh
$ npm install --save sorty
```

## Usage

Example 1
```js
var sorty = require('sorty')

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


//arr.should.eql(
[
    {name: 'bill', age: 40},
    {name: 'john', age: 100},
    {name: 'john', age: 20},
    {name: 'mary', age: 10}
]
//)
```

Example 2
```js
var sort = sorty([
    {name: 'name', dir: 'asc'},
    {name: 'age',  dir: 'desc', type: 'number'}
])

//now sort is a function that can be passed an array to sort it

sort(arr)
```

`sorty` returns the sorted array. Under the hoods, all it does is build a composed sort function, based on the given sort info, and call `array.sort` with that function.

You can specify a sort function in the sortInfo. **The sort function should always sort in ascending order!**. Actual sorting direction should be specified in the **dir** property.

### Sort info
Example of valid sort info:

```js
//an array
[
    //specify the type of values  - valid types: 'string' and 'number'
    { name: 'age', type: 'number'},
    { name: 'name', dir: 1 } //1 or asc (vs -1 or desc)
]

//an object - sort by only 1 property
{
    name: 'age'
}

//specify custom sort fn
[
    //since age may be string, but with numeric values, use a custom sort fn
    {name: 'age', fn: function(a, b){ return a * 1 - b * 1}, dir: 'desc' },
    {name: 'name', dir: 'asc'}
]
```

Valid sort types for now are:

 * 'string'
 * 'number'

The sort direction is specified in the **dir** property. Valid values are:

 * 1 (or 'asc', or any negative number)
 * -1 (or 'desc', or any positive number)

If you specify 0 (or any valsy value) for the sort direction, the sorting will not be done for the given property, but only for all other properties.

You can specify custom sort functions in the **fn** property. Those should always sort in ascending order!

## API

`sorty(sortInfo, array) // => sorted array` - sorty sorts the array in-place and returns it
`sorty(sortInfo) // => fn` - returns a curried version of sorty, which can be passed in an array, and will sort it, based on the sortInfo that was specified
`sorty.getFunction(sortInfo) // => sorting function` - sorty.getFunction returns the composed sort function, that can be used to sort an array.

## More examples


You can get a curried version, and just pass in an array afterwards, to get back the sorted array
```js
var sorty = require('sorty')
var sort  = sorty([
    {name: 'age', fn: function(a, b){ return a*1 - b * 1}, dir: 'desc' },
    {name: 'name', dir: 'asc'}
])

sort(arr)
```

You can get a sort function, and use it with array.sort
```js
var sorty = require('sorty')
var sortFn  = sorty.getFunction([
    {name: 'age', fn: function(a, b){ return a*1 - b * 1}, dir: 'desc' },
    {name: 'name', dir: 'asc'}
])

arr.sort(sortFn)
```

Regular usage
```js
var sorty = require('sorty')

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
```

```js
var sorty = require('sorty')

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
```

Specifying 0 (or any falsy value) as sort dir will skip the sort for the given property

```js
var sorty = require('sorty')

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
```
'use strict';

require('./index.styl')

var React  = require('react')
var DataGrid = require('react-datagrid')

var App = React.createClass({
    render: function() {
        return (
            <div className="App" style={{padding: 10}}>
                <p>
                    <h2>Coming soon</h2>

                </p>
            </div>
        )
    }
})
React.render(<App />, document.getElementById('content'))
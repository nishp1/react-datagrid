'use strict';

import React from 'react'
import {Route, DefaultRoute, NotFoundRoute} from 'react-router'

var Index    = require('./index')
var ExamplesRoute = require('./ExamplesRoute')
var Content = require('./Content')

module.exports = (
  <Route name="app" path="/" handler={Index}>
    <Route name="examples" path="/examples/:name" handler={ExamplesRoute}>
    	<NotFoundRoute handler={ExamplesRoute} />
    </Route>
    <Route path="/examples" handler={ExamplesRoute}>
    	<NotFoundRoute handler={ExamplesRoute} />
    </Route>

    <DefaultRoute handler={Content}/>
  </Route>
);
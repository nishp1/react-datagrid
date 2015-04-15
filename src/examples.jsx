'use strict';

import React from 'react'
import example from './example-template'

const all = [
	example('basic', {height: 470,
		description: <div>
			<h3>DataGrid features:</h3>
			<ul style={{lineHeight: '1.5em'}}>
				<li>Great rendering performance - even with millions of records</li>
				<li>Sized and flexible columns</li>
				<li>Single and multiple selection support</li>
				<li>Grouping</li>
				<li>Custom styling</li>
				<li>Custom cell rendering</li>
				<li>Support for sorting</li>
				<li>Support for filtering</li>
				<li>Visible/hidden columns</li>
			</ul>
		</div>
	}),
	example('reorder-columns', {height: 450}),
	example('column-resizing', {
		height: 350,
			description: <div>
				<p>
				Columns are flexible via flexbox. Specify a <b><code>flex</code></b> property for this. Unless a column specifies a <b><code>flex</code></b> or a <b><code>width</code></b> property, it is assumed to have <b><code>flex: 1</code></b>. You can also specify a <b><code>minWidth</code></b> property.
				</p>
				<p>
					And of course, horizontal scrollbars show when needed.
				</p>

			</div>
		}),
	example('large-data-array', {
							height: 550,
							description: <div>
								<p>You can have <b>huge</b> amounts of data in a grid.</p>
								<p>We have tested it with <b>1.000.000</b> records. </p>
								<p>In this demo, we are remotely fetching a json with <b>100.000 records</b> and showing them in the grid, so please wait a bit until the json is loaded. The browser might freeze for a moment while doing the JSON.parse. After this, the grid does its job and keeps everything running smoothly.</p>
								<p>In any case, the grid remains snappy no matter how large the data array is, since we only render a small subset of all data.</p>
							</div>
					}),

	example('sorting', {
		height: 550,
		description: <div>
			<p>The grid below is initially rendered as sorted, but you can modify sorting by clicking a column header.</p>
			<p>You can sort by multiple columns. Clicking on a column header multiple times sorts by that column ascending, then descending and them removes the sorting. Clicking again repeats this cicle</p>
			<p>For numeric columns, specify <b><code >type: "number"</code></b> in the column props.</p>
		</div>
	}),
	example('grouping', {
						height: 350
					}),

	example('filtering', {height: 450 }),
	example('empty-text-for-no-records', {height: 350 }),
	example('loading-grid', {height: 350 }),
	example('custom-column-styling', {height: 350 }),
	example('custom-column-rendering', {height: 350 }),
	example('custom-row-styling', {height: 350 }),
	example('custom-cell-borders', {height: 350 }),
	example('text-align-and-custom-row-height', {height: 350 }),
	example('restore-grid-state', {height: 750 })
]

const allMap = {}

all.map(function(item){
	allMap[item.prototype.name] = item
})

module.exports = {
	map  : allMap,
	array: all
}

'use strict'

import { Link } from 'react-router'
import { humanize } from 'ustring'

import { array as examples } from './examples'

const menuItems = examples.map(example => {

	var name = example.prototype.name

	return {
		name,
		text: humanize(name)
	}
})

let renderMenuItem = (item, index) =>
		<li key={index}>
			<Link activeStyle={{fontWeight: 'bold'}} to='examples' params={{name: item.name}}>
				{item.text}
			</Link>
		</li>

export default () => <ul className="example-menu">
	{menuItems.map(renderMenuItem)}
</ul>

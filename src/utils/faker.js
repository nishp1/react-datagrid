'use strict';

var faker = require('faker')
var size  = process.argv[2] * 1

var countries = [
    'USA',
    'Canada',
    'United Kingdom',
    'France',
    'Germany',
    'Italy',
    'Spain',
    'Japan',
    'China',
    'Romania',
    'Portugal'
]

function row(/*number*/ index) {
  return {
  	index: index + 1,
    id: 'id_' + index,
    avartar: faker.image.avatar(),
    city: faker.address.city(),
    // country: faker.address.country(),
    country: countries[Math.round(Math.random() * 10)],
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    street: faker.address.streetName(),
    zipCode: faker.address.zipCode(),
    date: faker.date.past(),
    bs: faker.company.bs(),
    grade : Math.round(Math.random() * 10),
    catchPhrase: faker.company.catchPhrase(),
    companyName: faker.company.companyName(),
    words: faker.lorem.words(),
    sentence: faker.lorem.sentence(),
  }
}

var res = []

for (var i = 0; i < size; i++){
	res.push(row(i))
}

res = 'module.exports = ' + JSON.stringify(res)

process.stdout.write(res + '\n')
const {schema} = require('normalizr')

const mission = require('../mission')
const rocket = require('../rocket')

const launch = schema.Entity('launches', {
  mission,
  rocket,
})

module.exports = launch

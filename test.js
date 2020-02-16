const assert = require('assert')

const webskitGradientParser = require('./src/index')
assert.ok(typeof webskitGradientParser.parse === 'function')

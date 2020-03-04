/* global describe it */
const assert = require('assert')
const parser = require('../src/index').parse

describe('Gradient parser, support for double-position stops', function () {
  it('should return a consecutive color-stop with the second length', function () {
    const gradient = 'linear-gradient(red, green 30% 50%, blue 60%)'
    const parsed = parser(gradient, true)
    assert.strict.deepEqual(parsed.stops, [
      ['red', '0%'],
      ['green', '30%'],
      ['green', '50%'],
      ['blue', '60%']
    ])
  })
})

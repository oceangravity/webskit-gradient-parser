/* global describe it */
const assert = require('assert')
const parser = require('../src/index').parse

describe('Gradient parser, one or more tab stops are missing', function () {
  it('should return 0% for first tab stop missing', function () {
    const gradient = 'linear-gradient(red, green 30%, blue 60%)'
    const parsed = parser(gradient, true)
    assert.strict.deepEqual(parsed.stops, [
      ['red', '0%'],
      ['green', '30%'],
      ['blue', '60%']
    ])
  })

  it('should return 100% for last tab stop missing', function () {
    const gradient = 'linear-gradient(red 40%, green 60%, blue)'
    const parsed = parser(gradient, true)
    assert.strict.deepEqual(parsed.stops, [
      ['red', '40%'],
      ['green', '60%'],
      ['blue', '100%']
    ])
  })

  it('should correctly interpolate a missing middle stop', function () {
    const gradient = 'linear-gradient(red 10%, green, blue 30%)'
    const parsed = parser(gradient, true)
    assert.strict.deepEqual(parsed.stops, [
      ['red', '10%'],
      ['green', '20%'],
      ['blue', '30%']
    ])
  })

  it('should correctly interpolate (to 2 decimals) when all stops are missing', function () {
    const gradient = 'linear-gradient(red, green, yellow, blue)'
    const parsed = parser(gradient, true)
    assert.strict.deepEqual(parsed.stops, [
      ['red', '0%'],
      ['green', '33.33%'],
      ['yellow', '66.67%'],
      ['blue', '100%']
    ])
  })

  it('should infer proper stop postfix for conic gradients', function () {
    const gradient = 'conic-gradient(red .2turn, green, blue)'
    const parsed = parser(gradient, true)
    assert.strict.deepEqual(parsed.stops, [
      ['red', '72deg'],
      ['green', '216deg'],
      ['blue', '360deg']
    ])
  })

  it('should correctly interpolate multiple missing stops', function () {
    const gradient = 'linear-gradient(red, green, yellow, blue 30%, red, green, yellow, blue 90%)'
    const parsed = parser(gradient, true)
    assert.strict.deepEqual(parsed.stops, [
      ['red', '0%'],
      ['green', '10%'],
      ['yellow', '20%'],
      ['blue', '30%'],
      ['red', '45%'],
      ['green', '60%'],
      ['yellow', '75%'],
      ['blue', '90%']
    ])
  })
})

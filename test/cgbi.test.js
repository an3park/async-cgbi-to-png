const convert = require('../index')
const fs = require('fs')

const ApplePNG = fs.readFileSync('test/cgbi.png')
const NonPNG = fs.readFileSync('test/cgbi.test.js')
const DefaultPng = fs.readFileSync('test/png.png')

test('non png shood return error callback', done => {
  convert(NonPNG, (err, png) => {
    expect(err).toBeInstanceOf(Error)
    expect(png).toBe(undefined)
    done()
  })
})

test('shood convert cgbi to png', done => {
  convert(ApplePNG, (err, png) => {
    expect(err).toBeNull()
    expect(png).toBeInstanceOf(Buffer)
    expect(png).toEqual(DefaultPng)
    done()
  })
})

test('shood return default png himself', done => {
  convert(DefaultPng, (err, png) => {
    expect(err).toBeNull()
    expect(png).toBeInstanceOf(Buffer)
    expect(png).toEqual(DefaultPng)
    done()
  })
})

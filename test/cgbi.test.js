const { convert } = require('..')
const fs = require('fs')

const NonPNG = Buffer.from('some text')

const ApplePNG = fs.readFileSync(__dirname + '/cgbi.png')
const DefaultPng = fs.readFileSync(__dirname + '/png.png')
const ApplePNG2 = fs.readFileSync(__dirname + '/cgbi2.png')
const DefaultPng2 = fs.readFileSync(__dirname + '/png2.png')

test('test common js module', () => {
  expect(require('..').convert).toBe(convert)
})

test('non png should return error callback', done => {
  convert(NonPNG, (err, png) => {
    expect(err).toBeInstanceOf(Error)
    expect(png).toBe(undefined)
    done()
  })
})

test('should convert cgbi to png', done => {
  convert(ApplePNG, (err, png) => {
    expect(err).toBeNull()
    expect(png).toBeInstanceOf(Buffer)
    expect(png).toEqual(DefaultPng)
    done()
  })
})

test('should convert cgbi to png (promise version)', done => {
  convert(ApplePNG).then(png => {
    expect(png).toBeInstanceOf(Buffer)
    expect(png).toEqual(DefaultPng)
    done()
  }).catch(()=>{})
})

test('should return default png himself', done => {
  convert(DefaultPng, (err, png) => {
    expect(err).toBeNull()
    expect(png).toBeInstanceOf(Buffer)
    expect(png).toEqual(DefaultPng)
    done()
  })
})

test('should convert cgbi to png 2', done => {
  convert(ApplePNG2, (err, png) => {
    expect(err).toBeNull()
    expect(png).toBeInstanceOf(Buffer)
    expect(png).toEqual(DefaultPng2)
    done()
  })
})

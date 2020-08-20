import { convert } from '..'
import fs from 'fs'

const ApplePNG = fs.readFileSync(__dirname + '/cgbi.png')
const NonPNG = fs.readFileSync(__dirname + '/cgbi.test.ts')
const DefaultPng = fs.readFileSync(__dirname + '/png.png')

test('test common js module', () => {
  expect(require('..').convert).toBe(convert)
})

test('non png should return error callback', done => {
  convert(NonPNG, (err: any, png: any) => {
    expect(err).toBeInstanceOf(Error)
    expect(png).toBe(undefined)
    done()
  })
})

test('should convert cgbi to png', done => {
  convert(ApplePNG, (err: any, png: any) => {
    expect(err).toBeNull()
    expect(png).toBeInstanceOf(Buffer)
    expect(png).toEqual(DefaultPng)
    done()
  })
})

test('should return default png himself', done => {
  convert(DefaultPng, (err: any, png: any) => {
    expect(err).toBeNull()
    expect(png).toBeInstanceOf(Buffer)
    expect(png).toEqual(DefaultPng)
    done()
  })
})

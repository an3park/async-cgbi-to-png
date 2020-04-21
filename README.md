### Converter Apple CgBI png to default png

Asynchronous non blocking typescript version

### Installation

```
npm install async-cgbi-to-png
```

### Usage

```js
const ApplePngConvert = require('async-cgbi-to-png')
const fs = require('fs')

const ApplePNG = fs.readFileSync('cgbi.png') // return Buffer instance

ApplePngConvert(ApplePNG, (err, resultPng) => {
  // resultPng is a Buffer
  if (err) throw err
  fs.writeFileSync('result.png', resultPng)
})
```

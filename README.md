### Converter Apple CgBI png to default png

Asynchronous non blocking typescript version

### Installation

```
npm install async-cgbi-to-png
```

### Usage

```js
const { convert } = require('async-cgbi-to-png')
const fs = require('fs')

const ApplePNG = fs.readFileSync('cgbi.png') // return Buffer instance

convert(ApplePNG, (err, resultPng) => {
  if (err) throw err
  // resultPng is a Buffer
  fs.writeFileSync('result.png', resultPng)
})
```

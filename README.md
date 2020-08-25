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

// using promise
convert(ApplePNG)
  .then(resultPng => {
    // resultPng is a Buffer
    fs.writeFileSync('result.png', resultPng)
  })
  .catch(console.error)

// or using async / await
try {
  const resultPng = await convert(ApplePNG)
} catch(_){}

// or u can pass callback
convert(ApplePNG, (err, resultPng) => {
  if (err) throw err
  fs.writeFileSync('result.png', resultPng)
})
```

import zlib from 'zlib'
import { crc32 } from 'crc'

declare global {
  namespace Buffer {
    function createUInt32BE(value: number): Buffer
  }
}

const PNG_HEADER = '89504e470d0a1a0a'

Buffer.createUInt32BE = function (value) {
  const buf = this.alloc(4)
  buf.writeUInt32BE(value)
  return buf
}

export default function (
  cgbi: Buffer,
  callback: (err: Error | null, data?: Buffer) => void
) {
  if (cgbi.slice(0, 8).toString('hex') !== PNG_HEADER) {
    callback(new Error('not png'))
    return
  }

  let len: number,
    type: string,
    data: Buffer,
    chsum: Buffer,
    offset: number = 8,
    issgbi: boolean = false,
    idatCRC: number,
    width: number,
    height: number,
    j: number,
    k: number,
    newData: Buffer,
    idatCgbiData: Buffer = Buffer.alloc(0),
    result = Buffer.from(PNG_HEADER, 'hex')
  const read = (n: number): Buffer => {
    offset += n
    return cgbi.slice(offset - n, offset)
  }
  while (offset < cgbi.length) {
    len = read(4).readUInt32BE()
    type = read(4).toString()
    data = read(len)
    chsum = read(4)
    // console.log(type, len)
    if (type === 'CgBI') {
      issgbi = true
      continue
    } else if (type === 'IHDR') {
      if (!issgbi) {
        callback(null, cgbi)
        return
      }
      width = data.readInt32BE()
      height = data.slice(4).readInt32BE()
    } else if (type === 'IDAT' && issgbi) {
      idatCgbiData = Buffer.concat([idatCgbiData, data])
      continue
    } else if (type === 'iDOT') {
      continue
    } else if (type === 'IEND' && issgbi) {
      zlib.inflateRaw(idatCgbiData, (err, uncompressed) => {
        if (err) {
          callback(err)
          return
        }
        newData = Buffer.alloc(uncompressed.length)
        let i = 0
        for (j = 0; j < height; ++j) {
          newData[i] = uncompressed[i]
          i++
          for (k = 0; k < width; ++k) {
            newData[i + 0] = uncompressed[i + 2]
            newData[i + 1] = uncompressed[i + 1]
            newData[i + 2] = uncompressed[i + 0]
            newData[i + 3] = uncompressed[i + 3]
            i += 4
          }
        }
        zlib.deflate(newData, (err, idatData) => {
          if (err) {
            callback(err)
            return
          }
          idatCRC = crc32('IDAT')
          idatCRC = crc32(idatData, idatCRC)
          idatCRC = (idatCRC + 0x100000000) % 0x100000000
          result = Buffer.concat([
            result,
            Buffer.createUInt32BE(idatData.length),
            Buffer.from('IDAT'),
            idatData,
            Buffer.createUInt32BE(idatCRC),
            Buffer.alloc(4),
            Buffer.from('IEND'),
            chsum
          ])
          callback(null, result)
        })
      })
      continue
    }
    result = Buffer.concat([
      result,
      Buffer.createUInt32BE(len),
      Buffer.from(type),
      data,
      chsum
    ])
  }
}

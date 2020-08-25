"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = void 0;
const zlib_1 = __importDefault(require("zlib"));
const crc_1 = require("crc");
const util_1 = require("util");
const asyncInflateRaw = util_1.promisify(zlib_1.default.inflateRaw);
const asyncDeflate = util_1.promisify(zlib_1.default.deflate);
const PNG_HEADER = Buffer.from('89504e470d0a1a0a', 'hex');
Buffer.createUInt32BE = function (value) {
    const buf = this.alloc(4);
    buf.writeUInt32BE(value);
    return buf;
};
class Reader {
    constructor(buf) {
        this.buf = buf;
        this.offset = 0;
    }
    read(bytes) {
        this.offset += bytes;
        return this.buf.slice(this.offset - bytes, this.offset);
    }
}
exports.convert = (cgbi, callback) => {
    const promise = new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        if (cgbi.slice(0, 8).compare(PNG_HEADER)) {
            return reject(new Error('not png'));
        }
        const reader = new Reader(cgbi);
        reader.offset = 8;
        const result = [PNG_HEADER];
        let iscgbi, header;
        const idat = [];
        while (reader.offset < cgbi.length) {
            const len = reader.read(4).readUInt32BE();
            const type = reader.read(4).toString();
            const data = reader.read(len);
            const chsum = reader.read(4);
            switch (type) {
                case 'CgBI':
                    iscgbi = true;
                    break;
                case 'iDOT':
                    break;
                case 'IDAT':
                    idat.push(data);
                    break;
                case 'IEND':
                    const rawdata = Buffer.concat(idat);
                    if (!header) {
                        return reject(new Error('error while reading png header'));
                    }
                    try {
                        const newIdat = yield defaultTransform(rawdata, header.width, header.height);
                        let idatCRC = crc_1.crc32('IDAT');
                        idatCRC = crc_1.crc32(newIdat, idatCRC);
                        idatCRC = (idatCRC + 0x100000000) % 0x100000000;
                        result.push(Buffer.createUInt32BE(newIdat.length), Buffer.from('IDAT'), newIdat, Buffer.createUInt32BE(idatCRC), Buffer.alloc(4), Buffer.from('IEND'), chsum);
                        return resolve(Buffer.concat(result));
                    }
                    catch (err) {
                        return reject(err);
                    }
                case 'IHDR':
                    if (!iscgbi)
                        return resolve(cgbi);
                    header = {
                        width: data.readUInt32BE(),
                        height: data.readUInt32BE(4),
                        bitDeph: data.readUInt8(8),
                        colorType: data.readUInt8(9),
                        comressMethod: data.readUInt8(10),
                        filterMethod: data.readUInt8(11),
                        interlaceMethod: data.readUInt8(12)
                    };
                default:
                    result.push(Buffer.createUInt32BE(len), Buffer.from(type), data, chsum);
                    break;
            }
        }
    }));
    if (callback && typeof callback === 'function') {
        promise.then(res => callback(null, res)).catch(err => callback(err));
    }
    else {
        return promise;
    }
};
function defaultTransform(image, width, height) {
    return __awaiter(this, void 0, void 0, function* () {
        const uncompressed = yield asyncInflateRaw(image);
        let newData = Buffer.alloc(uncompressed.length);
        let i = 0;
        for (let j = 0; j < height; ++j) {
            newData[i] = uncompressed[i];
            i++;
            for (let k = 0; k < width; ++k) {
                newData[i + 0] = uncompressed[i + 2];
                newData[i + 1] = uncompressed[i + 1];
                newData[i + 2] = uncompressed[i + 0];
                newData[i + 3] = uncompressed[i + 3];
                i += 4;
            }
        }
        return asyncDeflate(newData);
    });
}

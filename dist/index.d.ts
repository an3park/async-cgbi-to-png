declare global {
    namespace Buffer {
        function createUInt32BE(value: number): Buffer;
    }
}
export declare function convert(cgbi: Buffer, callback: (err: Error | null, data?: Buffer) => void): void;

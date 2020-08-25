declare global {
    namespace Buffer {
        function createUInt32BE(value: number): Buffer;
    }
}
declare type CallbackType<Ret> = (err: Error | null, data?: Ret) => void;
declare type A = (cgbi: Buffer, cb: CallbackType<Buffer>) => void;
declare type B = (cgbi: Buffer) => Promise<Buffer>;
export declare const convert: A | B;
export {};

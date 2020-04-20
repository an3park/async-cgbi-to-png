export = cgbiToPng

/**
 * Create simple png from Apple SgBI
 * @param cgbi Apple SgBI image Buffer
 * @param callback
 */
declare function cgbiToPng(cgbi: Buffer, callback: (err: Error | null, data?: Buffer) => void): void

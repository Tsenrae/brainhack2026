import Jimp from 'jimp';
import jsQR from 'jsqr';

export async function decodeQrFromBase64(base64: string): Promise<string | null> {
  try {
    const buffer = Buffer.from(base64, 'base64');
    const image = await Jimp.read(buffer);
    const { data, width, height } = image.bitmap;
    // Jimp bitmap.data is a Buffer (subclass of Uint8Array) of raw RGBA pixels
    const code = jsQR(new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength), width, height);
    return code?.data ?? null;
  } catch (err) {
    console.warn('[qrDecoder] decode failed:', (err as Error).message);
    return null;
  }
}

export type ActiveMode = 'to-base64' | 'to-image';

export type OutputFormat = 'raw' | 'data-url' | 'img' | 'css' | 'markdown';

export interface ImageData {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  width?: number;
  height?: number;
  base64Raw: string; // just the base64 characters
  dataUrl: string;   // prefix + base64 characters
}

export interface DecodedImage {
  width: number;
  height: number;
  sizeInBytes: number;
  mimeType: string;
  dataUrl: string;
}

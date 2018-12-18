declare function resize(fileBase64: any, size?: Array<number>, type?: string, quality?: number): Promise<{}>;
/**
     * Converte string base64 em objeto blob do JavaScript
     */
declare function base64ToBlob(e: any): Promise<{}>;
declare function rotateImage(direcaoRotate: any, idElement: any): void;
declare const getOrientation: (file: File, callback: Function) => void;
export { resize, base64ToBlob, rotateImage, getOrientation };

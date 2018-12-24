export interface Thumbs_Config {
    size: number;
    type: "image/jpeg" | "image/png" | "image/jpg";
    quality?: number;
}
export declare class Resize {
    private _file;
    private _thumbs_config;
    private _canvas;
    private _image;
    constructor(file: string | File, thumbs_config?: Array<Thumbs_Config>);
    isBase64(str: string): boolean;
    /**
     * Gera as thumbnails a partir dos dados
     * informados no constructor
     */
    generateThumbs(fromEXIF?: boolean): Promise<string[]>;
    /**
     * Gera canvas para desenha imagem dentro
     */
    private createCanvas;
    /**
     * Resedenha uma foto dentro de um canvas com um tamanho
     * pré-definido
     * @param size Tamanho da thumb
     * @param img elemento imagem renderizado
     * @param canvas elemento canvas criado
     */
    private drawNewThumb;
    /**
     * Lê um arquivo e retorna codificado em base64
     * @return {promise}
     * @param file {Arquivo do tipo File}
     */
    readFile(): Promise<string>;
    getOrientation(): Promise<number>;
    resetOrientation(srcOrientation: number): Promise<void>;
}
export declare function resetOrientation(srcBase64: string | File, srcOrientation: number, typeImage: string, callback: Function): void;
export declare function base64ToBlob(base64: string): Promise<Blob>;

export interface Thumbs_Config {
    size: number;
    type: "image/jpeg" | "image/png" | "image/jpg";
    quality?: number;
}
export declare class Resize {
    private _file;
    private _thumbs_config;
    constructor(file: string | File, thumbs_config: Array<Thumbs_Config>);
    isBase64(str: string): boolean;
    /**
     * Gera as thumbnails a partir dos dados
     * informados no constructor
     */
    generateThumbs(): Promise<any>;
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
    base64ToBlob(base64: string): Promise<Blob>;
    getOrientation(callback: Function): void;
}

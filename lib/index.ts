'use strict';

export interface Thumbs_Config {
    size: number,
    type: "image/jpeg" | "image/png" | "image/jpg",
    quality?: number
}

interface Draw_Image {
    size: number,
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
    type: "image/jpeg" | "image/png" | "image/jpg",
    quality?: number
}

interface Canvas {
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
}

export class Resize {

    private _file: string | File = '';
    private _thumbs_config: Array<Thumbs_Config> = [{
        size: 200,
        type: "image/jpeg",
    }];

    constructor(file: string | File, thumbs_config?: Array<Thumbs_Config>) {
        try {
            if (typeof file === 'string')
                if (this.isBase64(file))
                    this._file = file;
                else
                    throw new Error("File not is type base64 or File");

            else
                this._file = file;

        }
        catch (e) {
            console.error(e);
        }

        if (thumbs_config)
            this._thumbs_config = thumbs_config;
    }

    isBase64(str: string): boolean {
        let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return base64regex.test(str.split(',')[1]);
    }

    /**
     * Gera as thumbnails a partir dos dados
     * informados no constructor
     */
    async generateThumbs(): Promise<string[]> {
        const quant: number = this._thumbs_config.length; // Quantidade de miniaturas a ser geradas

        // Função que está configurado para gerar minuaturas 
        // de acordo com tamanhos do array de config
        let gerThumb = async (cnt: number): Promise<any> => {
            let getCanvas = await this.createCanvas(); // Desenha canvas

            // Configurações da minuatura
            let data: Draw_Image = {
                size: this._thumbs_config[cnt].size,
                img: getCanvas.img,
                canvas: getCanvas.canvas,
                type: this._thumbs_config[cnt].type,
                quality: this._thumbs_config[cnt].quality
            }

            // Gera thumb e retorna em base64
            return await this.drawNewThumb(data);
        }

        let thumbsPromises: Promise<any>[] = []
        for (let i = 0; i < quant; i++) {
            thumbsPromises.push(gerThumb(i))
        }

        return await Promise.all(thumbsPromises);
    }

    /**
     * Gera canvas para desenha imagem dentro
     */
    private createCanvas(): Promise<Canvas> {
        return new Promise((resolve, reject) => {
            let img: HTMLImageElement = new Image();

            img.onload = () => {
                let canvas = document.createElement("canvas");
                let ctx = (canvas.getContext("2d") as CanvasRenderingContext2D);

                ctx.drawImage(img, 0, 0);

                resolve({ img: img, canvas: canvas });
            }

            if (typeof this._file === 'string')
                img.src = this._file;
            else {
                this.readFile().then((base64: string) => {
                    img.src = base64;
                }).catch((error) => {
                    reject(error);
                });

            }

        });

    }

    /**
     * Resedenha uma foto dentro de um canvas com um tamanho
     * pré-definido
     * @param size Tamanho da thumb
     * @param img elemento imagem renderizado
     * @param canvas elemento canvas criado
     */
    private async drawNewThumb(data: Draw_Image): Promise<string> {
        let MAX_WIDTH = data.size;
        let MAX_HEIGHT = data.size;
        let img_width = data.img.width;
        let img_height = data.img.height;

        if (img_width > img_height) {
            if (img_width > MAX_WIDTH) {
                img_height *= MAX_WIDTH / img_width;
                img_width = MAX_WIDTH;
            }
        } else {
            if (img_height > MAX_HEIGHT) {
                img_width *= MAX_HEIGHT / img_height;
                img_height = MAX_HEIGHT;
            }
        }

        data.canvas.width = img_width;
        data.canvas.height = img_height;
        let ctx = (data.canvas.getContext("2d") as CanvasRenderingContext2D);
        ctx.drawImage(data.img, 0, 0, img_width, img_height);

        return data.canvas.toDataURL(data.type, data.quality); // O segundo parâmetro é um int de 0 a 1 que indica a qualidade da imagem
    }

    /**
     * Lê um arquivo e retorna codificado em base64
     * @return {promise}  
     * @param file {Arquivo do tipo File}
     */
    async readFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (typeof this._file === "object") {
                let reader = new FileReader();

                reader.onload = (ev: ProgressEvent) => {

                    if (!event.target) {
                        reject();
                    }

                    const file = event.target as FileReader;
                    resolve(file.result as string);
                }

                reader.onerror = (error) => {
                    reject(error);
                }

                reader.readAsDataURL(this._file);

            } else
                reject("File already is in base64");

        });
    }

    getOrientation(callback: Function) {
        let reader = new FileReader();

        reader.onload = (event: ProgressEvent) => {

            if (!event.target) {
                return;
            }

            const file = event.target as FileReader;
            const view = new DataView(file.result as ArrayBuffer);

            if (view.getUint16(0, false) != 0xFFD8) {
                return callback(-2);
            }

            const length = view.byteLength
            let offset = 2;

            while (offset < length) {
                if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
                let marker = view.getUint16(offset, false);
                offset += 2;

                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) {
                        return callback(-1);
                    }

                    let little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    let tags = view.getUint16(offset, little);
                    offset += 2;
                    for (let i = 0; i < tags; i++) {
                        if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                            return callback(view.getUint16(offset + (i * 12) + 8, little));
                        }
                    }
                } else if ((marker & 0xFF00) != 0xFF00) {
                    break;
                }
                else {
                    offset += view.getUint16(offset, false);
                }
            }
            return callback(-1);
        };

        try {
            if (typeof this._file === "object")
                reader.readAsArrayBuffer(this._file);
            else
                throw new Error('File type not permitted, only file type Blob');

        }
        catch (e) {
            console.error(e);
        }
    }

    resetOrientation(srcBase64: string, srcOrientation: number, typeImage: string, callback: Function) {
        let img = new Image();

        img.onload = function () {
            let width = img.width,
                height = img.height,
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext("2d");

            // set proper canvas dimensions before transform & export
            if (4 < srcOrientation && srcOrientation < 9) {
                canvas.width = height;
                canvas.height = width;
            } else {
                canvas.width = width;
                canvas.height = height;
            }

            // transform context before drawing image
            switch (srcOrientation) {
                case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
                case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
                case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
                case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
                case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
                case 7: ctx.transform(0, -1, -1, 0, height, width); break;
                case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
                default: break;
            }

            // draw image
            ctx.drawImage(img, 0, 0);

            // export base64
            callback(canvas.toDataURL(typeImage));
        };

        img.src = srcBase64;
    }

}


export function base64ToBlob(base64: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        let byteString = atob(base64.split(',')[1]);

        // Separa o tipo de arquivo na base64
        let mimeString = base64.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        let bb: any = new Blob([ab], { type: mimeString });

        if (bb) resolve(bb)
        else reject('Falha ao criar Blob!');
    });

}




// let input = document.getElementById('file');

// input.onchange = async (ev: any) => {
//     let file = ev.target.files[0];
//     let config_thumb: Thumbs_Config[] = [
//         {
//             size: 100,
//             type: "image/jpeg",
//             quality: 0.1
//         },
//         {
//             size: 100,
//             type: "image/png",
//             quality: 1
//         },
//         {
//             size: 200,
//             type: "image/png",
//             quality: 0.1
//         },
//         {
//             size: 700,
//             type: "image/jpeg",
//             quality: 1
//         },
//     ]


//     let resize = new Resize(file, config_thumb);

//     // let original = new Image();
//     // original.src = await resize.readFile(file);
//     // document.body.appendChild(original);


//     resize.generateThumbs().then((result: string[]) => {
//         result.map((base64: string) => {
//             let thumb = new Image();
//             thumb.src = base64;
//             thumb.style.margin = "25px";
//             document.body.appendChild(thumb);

//             resize.base64ToBlob(base64).then((value: any) => {
//                 resize.getOrientation((e: number) => {
//                     value.orientation = e;
//                     console.log(value);
//                 })
//             });

//         });


//     }).catch((error) => {
//         console.error(error);
//     });

// }

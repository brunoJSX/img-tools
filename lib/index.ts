function resize(fileBase64, size: Array<number> = [200], type = 'image/jpeg', quality = 0.92) {
    return new Promise((resolve, reject) => {
        var ret = [];
        if (Array.isArray(size)) {
            var promisesArray = [];
            for (var i = 0; i < size.length; i++) {
                promisesArray.push(resizeCanvas(fileBase64, size[i], type, quality));

            }
            var promisesResolved = Promise.all(promisesArray);
            promisesResolved.then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })

        } else {
            resizeCanvas(fileBase64, size, type, quality).then((base64) => {
                ret.push(base64)
                resolve(ret);
            }).catch((err) => {
                reject(err);
            })
        }
    })

}

async function resizeCanvas(fileBase64, size, type, quality) {
    var img = document.createElement("img");
    img.src = fileBase64;

    var canvas = document.createElement("canvas");
    await createImgElement(img, canvas);

    var MAX_WIDTH = size;
    var MAX_HEIGHT = size;
    var img_width = img.width;
    var img_height = img.height;

    console.log("Width da image: ", img.width);
    console.log("Height da image: ", img.height);

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

    canvas.width = img_width;
    canvas.height = img_height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img_width, img_height);

    return canvas.toDataURL(type, quality); // O segundo parâmetro é um int de 0 a 1 que indica a qualidade da imagem
}

/**
* Espere até que o contexto do canvas seja desenhado
*/
function createImgElement(img, canvas) {
    return new Promise((resolve, reject) => {
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(true);
    });
}

/**
     * Converte string base64 em objeto blob do JavaScript
     */
function base64ToBlob(e) {
    return new Promise((resolve, reject) => {
        var byteString = atob(e.base64.split(',')[1]);

        // separate out the mime component
        var mimeString = e.base64.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var bb: any = new Blob([ab], { type: mimeString });
        bb.name = e.name;

        if (bb) resolve(bb)
        else reject('Falha ao criar Blob!');
    });

}

function rotateImage(direcaoRotate, idElement) {
    let el = document.getElementById(idElement);

    let angle = 0;

    if (direcaoRotate === 'left') {
        angle = angle - 90;

        el.setAttribute('style', `
            transform: rotate(${angle}deg);
            -webkit-transform: rotate(${angle}deg);
            -ms-transform: rotate(${angle}deg);
        `)
    } else {
        angle = angle + 90;

        el.setAttribute('style', `
            transform: rotate(${angle}deg);
            -webkit-transform: rotate(${angle}deg);
            -ms-transform: rotate(${angle}deg);
        `)
    }
}

const getOrientation = (file: File, callback: Function) => {
    var reader = new FileReader();

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

    reader.readAsArrayBuffer(file);
}

export { resize, base64ToBlob, rotateImage, getOrientation };
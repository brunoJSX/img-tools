"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function resize(fileBase64, size, type, quality) {
    if (size === void 0) { size = 200; }
    if (type === void 0) { type = 'image/jpeg'; }
    if (quality === void 0) { quality = 0.92; }
    return new Promise(function (resolve, reject) {
        var ret = [];
        if (Array.isArray(size)) {
            var promisesArray = [];
            for (var i = 0; i < size.length; i++) {
                promisesArray.push(resizeCanvas(fileBase64, size[i], type, quality));
            }
            var promisesResolved = Promise.all(promisesArray);
            promisesResolved.then(function (result) {
                resolve(result);
            }).catch(function (err) {
                reject(err);
            });
        }
        else {
            resizeCanvas(fileBase64, size, type, quality).then(function (base64) {
                ret.push(base64);
                resolve(ret);
            }).catch(function (err) {
                reject(err);
            });
        }
    });
}
exports.resize = resize;
function resizeCanvas(fileBase64, size, type, quality) {
    return __awaiter(this, void 0, void 0, function () {
        var img, canvas, MAX_WIDTH, MAX_HEIGHT, img_width, img_height, ctx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    img = document.createElement("img");
                    img.src = fileBase64;
                    canvas = document.createElement("canvas");
                    return [4 /*yield*/, createImgElement(img, canvas)];
                case 1:
                    _a.sent();
                    MAX_WIDTH = size;
                    MAX_HEIGHT = size;
                    img_width = img.width;
                    img_height = img.height;
                    console.log("Width da image: ", img.width);
                    console.log("Height da image: ", img.height);
                    if (img_width > img_height) {
                        if (img_width > MAX_WIDTH) {
                            img_height *= MAX_WIDTH / img_width;
                            img_width = MAX_WIDTH;
                        }
                    }
                    else {
                        if (img_height > MAX_HEIGHT) {
                            img_width *= MAX_HEIGHT / img_height;
                            img_height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = img_width;
                    canvas.height = img_height;
                    ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, img_width, img_height);
                    return [2 /*return*/, canvas.toDataURL(type, quality)]; // O segundo parâmetro é um int de 0 a 1 que indica a qualidade da imagem
            }
        });
    });
}
/**
* Espere até que o contexto do canvas seja desenhado
*/
function createImgElement(img, canvas) {
    return new Promise(function (resolve, reject) {
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(true);
    });
}
/**
     * Converte string base64 em objeto blob do JavaScript
     */
function base64ToBlob(e) {
    return new Promise(function (resolve, reject) {
        var byteString = atob(e.base64.split(',')[1]);
        // separate out the mime component
        var mimeString = e.base64.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        // write the ArrayBuffer to a blob, and you're done
        var bb = new Blob([ab], { type: mimeString });
        bb.name = e.name;
        if (bb)
            resolve(bb);
        else
            reject('Falha ao criar Blob!');
    });
}
exports.base64ToBlob = base64ToBlob;
function rotateImage(direcaoRotate, idElement) {
    var el = document.getElementById(idElement);
    var angle = 0;
    if (direcaoRotate === 'left') {
        angle = angle - 90;
        el.setAttribute('style', "\n            transform: rotate(" + angle + "deg);\n            -webkit-transform: rotate(" + angle + "deg);\n            -ms-transform: rotate(" + angle + "deg);\n        ");
    }
    else {
        angle = angle + 90;
        el.setAttribute('style', "\n            transform: rotate(" + angle + "deg);\n            -webkit-transform: rotate(" + angle + "deg);\n            -ms-transform: rotate(" + angle + "deg);\n        ");
    }
}
exports.rotateImage = rotateImage;
var getOrientation = function (file, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
        if (!event.target) {
            return;
        }
        var file = event.target;
        var view = new DataView(file.result);
        if (view.getUint16(0, false) != 0xFFD8) {
            return callback(-2);
        }
        var length = view.byteLength;
        var offset = 2;
        while (offset < length) {
            if (view.getUint16(offset + 2, false) <= 8)
                return callback(-1);
            var marker = view.getUint16(offset, false);
            offset += 2;
            if (marker == 0xFFE1) {
                if (view.getUint32(offset += 2, false) != 0x45786966) {
                    return callback(-1);
                }
                var little = view.getUint16(offset += 6, false) == 0x4949;
                offset += view.getUint32(offset + 4, little);
                var tags = view.getUint16(offset, little);
                offset += 2;
                for (var i = 0; i < tags; i++) {
                    if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                        return callback(view.getUint16(offset + (i * 12) + 8, little));
                    }
                }
            }
            else if ((marker & 0xFF00) != 0xFF00) {
                break;
            }
            else {
                offset += view.getUint16(offset, false);
            }
        }
        return callback(-1);
    };
    reader.readAsArrayBuffer(file);
};
exports.getOrientation = getOrientation;

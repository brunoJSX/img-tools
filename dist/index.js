'use strict';
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
var Resize = /** @class */ (function () {
    function Resize(file, thumbs_config) {
        this._file = '';
        this._thumbs_config = [{
                size: 200,
                type: "image/jpeg",
            }];
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
    Resize.prototype.isBase64 = function (str) {
        var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return base64regex.test(str.split(',')[1]);
    };
    /**
     * Gera as thumbnails a partir dos dados
     * informados no constructor
     * @param fromEXIF parâmetro opcional para rotacionar a foto de acordo com os dados EXIF da mesma
     */
    Resize.prototype.generateThumbs = function (fromEXIF) {
        return __awaiter(this, void 0, void 0, function () {
            var quant, gerThumb, thumbsPromises, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        quant = this._thumbs_config.length;
                        gerThumb = function (cnt) { return __awaiter(_this, void 0, void 0, function () {
                            var getCanvas, data;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.createCanvas()];
                                    case 1:
                                        getCanvas = _a.sent();
                                        data = {
                                            size: this._thumbs_config[cnt].size,
                                            img: getCanvas.img,
                                            canvas: getCanvas.canvas,
                                            type: this._thumbs_config[cnt].type,
                                            quality: this._thumbs_config[cnt].quality
                                        };
                                        return [4 /*yield*/, this.drawNewThumb(data, fromEXIF)];
                                    case 2: 
                                    // return getCanvas
                                    // Gera thumb e retorna em base64
                                    return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        thumbsPromises = [];
                        for (i = 0; i < quant; i++) {
                            thumbsPromises.push(gerThumb(i));
                        }
                        return [4 /*yield*/, Promise.all(thumbsPromises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Gera canvas para desenha imagem dentro
     */
    Resize.prototype.createCanvas = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                var elements = { img: img, canvas: canvas };
                // Desenha canvas da imagem sem EXIF
                ctx.drawImage(img, 0, 0);
                resolve(elements);
            };
            if (typeof _this._file === 'string')
                img.src = _this._file;
            else {
                _this.readFile().then(function (base64) {
                    img.src = base64;
                }).catch(function (error) {
                    reject(error);
                });
            }
        });
    };
    /**
     * Redesenha uma foto dentro de um canvas com um tamanho
     * pré-definido
     * @param size Tamanho da thumb
     * @param img elemento imagem renderizado
     * @param canvas elemento canvas criado
     * @param fromEXIF Rotaciona a foto de acordo com os dados EXIF da mesma
     */
    Resize.prototype.drawNewThumb = function (data, fromEXIF) {
        return __awaiter(this, void 0, void 0, function () {
            var MAX_WIDTH, MAX_HEIGHT, img_width, img_height, ctx, elements, orientation_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        MAX_WIDTH = data.size;
                        MAX_HEIGHT = data.size;
                        img_width = data.img.width;
                        img_height = data.img.height;
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
                        data.canvas.width = img_width;
                        data.canvas.height = img_height;
                        ctx = data.canvas.getContext("2d");
                        if (!fromEXIF) return [3 /*break*/, 3];
                        elements = { img: data.img, canvas: data.canvas };
                        return [4 /*yield*/, this.getOrientation().catch(function (e) { return e; })];
                    case 1:
                        orientation_1 = _a.sent();
                        return [4 /*yield*/, this.resetOrientation(orientation_1, elements).catch(function (e) { return e; })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        ctx.drawImage(data.img, 0, 0, img_width, img_height);
                        return [2 /*return*/, data.canvas.toDataURL(data.type, data.quality)]; // O segundo parâmetro é um int de 0 a 1 que indica a qualidade da imagem
                }
            });
        });
    };
    /**
     * Lê um arquivo e retorna codificado em base64
     * @return {promise}
     * @param file {Arquivo do tipo File}
     */
    Resize.prototype.readFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (typeof _this._file === "object") {
                            var reader = new FileReader();
                            reader.onload = function (ev) {
                                if (!event.target) {
                                    reject();
                                }
                                var file = event.target;
                                resolve(file.result);
                            };
                            reader.onerror = function (error) {
                                reject(error);
                            };
                            reader.readAsDataURL(_this._file);
                        }
                        else
                            reject("File already is in base64");
                    })];
            });
        });
    };
    Resize.prototype.getOrientation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            if (!event.target) {
                                return;
                            }
                            var file = event.target;
                            var view = new DataView(file.result);
                            if (view.getUint16(0, false) != 0xFFD8) {
                                resolve(-2);
                            }
                            var length = view.byteLength;
                            var offset = 2;
                            while (offset < length) {
                                if (view.getUint16(offset + 2, false) <= 8)
                                    return resolve(-1);
                                var marker = view.getUint16(offset, false);
                                offset += 2;
                                if (marker == 0xFFE1) {
                                    if (view.getUint32(offset += 2, false) != 0x45786966) {
                                        resolve(-1);
                                    }
                                    var little = view.getUint16(offset += 6, false) == 0x4949;
                                    offset += view.getUint32(offset + 4, little);
                                    var tags = view.getUint16(offset, little);
                                    offset += 2;
                                    for (var i = 0; i < tags; i++) {
                                        if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                                            resolve(view.getUint16(offset + (i * 12) + 8, little));
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
                            resolve(-1);
                        };
                        if (typeof _this._file === "object")
                            reader.readAsArrayBuffer(_this._file);
                        else {
                            base64ToBlob(_this._file).then(function (file) {
                                reader.readAsArrayBuffer(file);
                            }).catch(function (e) {
                                reject(e);
                            });
                        }
                    })];
            });
        });
    };
    Resize.prototype.resetOrientation = function (srcOrientation, elements) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var width = elements.canvas.width, height = elements.canvas.height, ctx = elements.canvas.getContext("2d");
                        // set proper canvas dimensions before transform & export
                        if (4 < srcOrientation && srcOrientation < 9) {
                            elements.canvas.width = height;
                            elements.canvas.height = width;
                        }
                        else {
                            elements.canvas.width = width;
                            elements.canvas.height = height;
                        }
                        // transform context before drawing image
                        switch (srcOrientation) {
                            case 2:
                                ctx.transform(-1, 0, 0, 1, width, 0);
                                break;
                            case 3:
                                ctx.transform(-1, 0, 0, -1, width, height);
                                break;
                            case 4:
                                ctx.transform(1, 0, 0, -1, 0, height);
                                break;
                            case 5:
                                ctx.transform(0, 1, 1, 0, 0, 0);
                                break;
                            case 6:
                                ctx.transform(0, 1, -1, 0, height, 0);
                                break;
                            case 7:
                                ctx.transform(0, -1, -1, 0, height, width);
                                break;
                            case 8:
                                ctx.transform(0, -1, 1, 0, 0, width);
                                break;
                            default: break;
                        }
                        // draw image
                        // ctx.drawImage(elements.img, 0, 0);
                        resolve(elements);
                    })];
            });
        });
    };
    return Resize;
}());
exports.Resize = Resize;
function resetOrientation(srcBase64, srcOrientation, typeImage, callback) {
    var img = new Image();
    if (typeof srcBase64 === 'object') {
        var reader = new FileReader();
        reader.onload = function (ev) {
            srcBase64 = ev.target.result;
        };
        reader.readAsDataURL(srcBase64);
    }
    img.onload = function () {
        var width = img.width, height = img.height, canvas = document.createElement('canvas'), ctx = canvas.getContext("2d");
        // set proper canvas dimensions before transform & export
        if (4 < srcOrientation && srcOrientation < 9) {
            canvas.width = height;
            canvas.height = width;
        }
        else {
            canvas.width = width;
            canvas.height = height;
        }
        // transform context before drawing image
        switch (srcOrientation) {
            case 2:
                ctx.transform(-1, 0, 0, 1, width, 0);
                break;
            case 3:
                ctx.transform(-1, 0, 0, -1, width, height);
                break;
            case 4:
                ctx.transform(1, 0, 0, -1, 0, height);
                break;
            case 5:
                ctx.transform(0, 1, 1, 0, 0, 0);
                break;
            case 6:
                ctx.transform(0, 1, -1, 0, height, 0);
                break;
            case 7:
                ctx.transform(0, -1, -1, 0, height, width);
                break;
            case 8:
                ctx.transform(0, -1, 1, 0, 0, width);
                break;
            default: break;
        }
        // draw image
        ctx.drawImage(img, 0, 0);
        // export base64
        callback(canvas.toDataURL(typeImage));
    };
    img.src = srcBase64;
}
exports.resetOrientation = resetOrientation;
function base64ToBlob(base64) {
    return new Promise(function (resolve, reject) {
        var byteString = atob(base64.split(',')[1]);
        // Separa o tipo de arquivo na base64
        var mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        // write the ArrayBuffer to a blob, and you're done
        var bb = new Blob([ab], { type: mimeString });
        if (bb)
            resolve(bb);
        else
            reject('Falha ao criar Blob!');
    });
}
exports.base64ToBlob = base64ToBlob;

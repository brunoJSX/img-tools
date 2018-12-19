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
                quality: 0.8
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
        try {
            if (thumbs_config.length > 0)
                this._thumbs_config = thumbs_config;
            else
                throw new Error("Required sizes for generate thumbnails");
        }
        catch (e) {
            console.error(e);
        }
    }
    Resize.prototype.isBase64 = function (str) {
        var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return base64regex.test(str.split(',')[1]);
    };
    /**
     * Gera as thumbnails a partir dos dados
     * informados no constructor
     */
    Resize.prototype.generateThumbs = function () {
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
                                        return [4 /*yield*/, this.drawNewThumb(data)];
                                    case 2: 
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
                ctx.drawImage(img, 0, 0);
                resolve({ img: img, canvas: canvas });
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
     * Resedenha uma foto dentro de um canvas com um tamanho
     * pré-definido
     * @param size Tamanho da thumb
     * @param img elemento imagem renderizado
     * @param canvas elemento canvas criado
     */
    Resize.prototype.drawNewThumb = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var MAX_WIDTH, MAX_HEIGHT, img_width, img_height, ctx;
            return __generator(this, function (_a) {
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
                ctx.drawImage(data.img, 0, 0, img_width, img_height);
                console.log('Perfil foto', { type: data.type, quality: data.quality });
                return [2 /*return*/, data.canvas.toDataURL(data.type, data.quality)]; // O segundo parâmetro é um int de 0 a 1 que indica a qualidade da imagem
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
    Resize.prototype.base64ToBlob = function (base64) {
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
    };
    Resize.prototype.getOrientation = function (callback) {
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
        try {
            if (typeof this._file === "object")
                reader.readAsArrayBuffer(this._file);
            else
                throw new Error('File type not permitted, only file type Blob');
        }
        catch (e) {
            console.error(e);
        }
    };
    return Resize;
}());
exports.Resize = Resize;

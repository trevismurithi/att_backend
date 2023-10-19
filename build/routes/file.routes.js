"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileRouter = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const utils_services_js_1 = require("../services/utils.services.js");
const file_controller_js_1 = require("../controller/file.controller.js");
const fileRouter = express_1.default.Router();
exports.fileRouter = fileRouter;
const upload = (0, multer_1.default)({ dest: path_1.default.join('uploads/'), fileFilter: utils_services_js_1.fileFilter });
fileRouter.post('/upload/:name', upload.single('file'), file_controller_js_1.uploadCSV);

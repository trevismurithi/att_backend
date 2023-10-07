"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareDate = exports.verifyUser = exports.signUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function signUser(payload, expiresIn) {
    const secret = process.env.SECRET_KEY;
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn
    });
}
exports.signUser = signUser;
function verifyUser(token) {
    const secret = process.env.SECRET_KEY;
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return {};
    }
}
exports.verifyUser = verifyUser;
function compareDate(start, end) {
    const timeDiff = new Date(end).getTime() - new Date(start).getTime();
    return new Date(timeDiff).getMinutes();
}
exports.compareDate = compareDate;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.hashing = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
function hashing(password) {
    const salt = bcrypt_1.default.genSaltSync(saltRounds);
    const hash = bcrypt_1.default.hashSync(password, salt);
    return hash;
}
exports.hashing = hashing;
function compareHash(password, hash) {
    return bcrypt_1.default.compareSync(password, hash);
}
exports.compareHash = compareHash;

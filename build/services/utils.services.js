"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDateFormat = exports.compareDate = exports.validate = exports.adminFileFilter = exports.fileFilter = void 0;
const jwt_js_1 = require("./jwt.js");
const user_model_js_1 = require("../models/user.model.js");
async function validate(req) {
    // verify if user
    if (!req.headers.authorization) {
        return false;
    }
    const token = req.headers.authorization.split(' ')[1];
    const tokenUser = (0, jwt_js_1.verifyUser)(token);
    if (!tokenUser.username) {
        return false;
    }
    const user = await (0, user_model_js_1.getUserByField)({ username: tokenUser.username });
    if (!user) {
        return false;
    }
    return user;
}
exports.validate = validate;
async function fileFilter(req, file, cb) {
    const state = await validate(req);
    if (!state) {
        cb(new Error('user not authorized'));
        return false;
    }
    if (['text/csv'].includes(file.mimetype)) {
        cb(null, state);
    }
    else {
        cb(null, false);
    }
}
exports.fileFilter = fileFilter;
async function adminFileFilter(req, file, cb) {
    // verify is admin
    const state = await validate(req);
    if (!state) {
        cb(new Error('user not authorized'));
        return false;
    }
    if (state.role === 'ADMIN') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
exports.adminFileFilter = adminFileFilter;
function compareDate(start, end) {
    const timeDiff = new Date(end).getTime() - new Date(start).getTime();
    return new Date(timeDiff).getMinutes();
}
exports.compareDate = compareDate;
function useDateFormat(date) {
    const formatDate = new Date(date);
    return formatDate.getDate() + '/' + (formatDate.getMonth() + 1) + '/' + formatDate.getFullYear();
}
exports.useDateFormat = useDateFormat;

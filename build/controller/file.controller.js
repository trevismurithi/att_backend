"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCSV = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const csv_parse_1 = require("csv-parse");
const utils_services_js_1 = require("../services/utils.services.js");
const user_model_js_1 = require("../models/user.model.js");
const unlink = util_1.default.promisify(fs_1.default.unlink);
const fileInfo = util_1.default.promisify(fs_1.default.stat);
async function uploadCSV(req, res) {
    let phoneNumbers = [];
    let userData = null;
    if (!req.file) {
        return res.status(404).json({ message: 'file has not been found' });
    }
    if (!req.params && !req.params.name) {
        return res.status(400).json({ message: 'bad request' });
    }
    try {
        // validate user
        const user = await (0, utils_services_js_1.validate)(req);
        // save file key to database
        if (!user) {
            return res.status(401).json({ message: 'user is not valid' });
        }
        await fileInfo(req.file.path);
        // read csv
        fs_1.default.createReadStream(req.file.path)
            .pipe((0, csv_parse_1.parse)({ delimiter: ',' }))
            .on('data', async function (row) {
            phoneNumbers = row.map((num) => ({ phone: num }));
        })
            .on('error', function (error) {
            console.log('error: ', error);
        })
            .on('end', async function () {
            console.log('finished');
            userData = await (0, user_model_js_1.updateUser)(user.id, {
                groups: {
                    create: {
                        name: req.params.name,
                        contacts: {
                            createMany: {
                                data: phoneNumbers
                            }
                        }
                    }
                }
            });
            // save numbers to DB
            await unlink(req.file.path);
            return res.status(200).json({
                message: 'csv has been uploaded',
                userData
            });
        });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
}
exports.uploadCSV = uploadCSV;

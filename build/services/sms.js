"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMTSMSOne = exports.sendMTSMS = exports.sendATSMS = void 0;
const AfricasTalking = require('africastalking');
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const user_model_1 = require("../models/user.model");
require('dotenv').config();
// TODO: Initialize Africa's Talking
const africastalking = AfricasTalking({
    apiKey: process.env.AFRICA_API_KEY,
    username: process.env.AFRICA_USERNAME
});
async function sendATSMS(numbers, message) {
    // TODO: Send message
    try {
        const result = await africastalking.SMS.send({
            to: numbers,
            message: message,
            // from: '[Your_sender_ID_goes_here]'
        });
        console.log(result.data);
    }
    catch (ex) {
        console.error(ex);
    }
}
exports.sendATSMS = sendATSMS;
;
async function sendMTSMS(numbers, message, user) {
    try {
        const result = await axios_1.default.post('https://api.mobitechtechnologies.com/sms/sendbulksms', {
            "mobile": numbers,
            "response_type": "json",
            "sender_name": "23107",
            "service_id": 0,
            "message": message
        }, {
            headers: {
                h_api_key: process.env.MOBI_API_KEY,
                "Content-Type": "application/json"
            }
        });
        const balance = user.wallet.amount - (numbers.split(',').length * .8);
        await (0, user_model_1.updateUser)(1, {
            wallet: {
                upsert: {
                    create: {
                        amount: balance
                    },
                    update: {
                        amount: balance
                    }
                }
            }
        });
        console.log(result.data);
    }
    catch (error) {
        console.error(error);
    }
}
exports.sendMTSMS = sendMTSMS;
async function sendMTSMSOne(numbers, message, user) {
    try {
        const result = await axios_1.default.post('https://api.mobitechtechnologies.com/sms/sendsms', {
            "mobile": numbers,
            "response_type": "json",
            "sender_name": "23107",
            "service_id": 0,
            "message": message
        }, {
            headers: {
                h_api_key: process.env.MOBI_API_KEY,
                "Content-Type": "application/json"
            }
        });
        console.log(result.data);
        const balance = user.wallet.amount - .8;
        await (0, user_model_1.updateUser)(1, {
            wallet: {
                upsert: {
                    create: {
                        amount: balance
                    },
                    update: {
                        amount: balance
                    }
                }
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}
exports.sendMTSMSOne = sendMTSMSOne;

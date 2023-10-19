"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const AfricasTalking = require('africastalking');
require('dotenv').config();
// TODO: Initialize Africa's Talking
const africastalking = AfricasTalking({
    apiKey: process.env.AFRICA_API_KEY,
    username: process.env.AFRICA_USERNAME
});
async function sendSMS(numbers, message) {
    // TODO: Send message
    try {
        const result = await africastalking.SMS.send({
            to: numbers,
            message: message,
            // from: '[Your_sender_ID_goes_here]'
        });
        console.log(result);
    }
    catch (ex) {
        console.error(ex);
    }
}
exports.sendSMS = sendSMS;
;

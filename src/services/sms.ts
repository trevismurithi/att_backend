const AfricasTalking = require('africastalking');
require('dotenv').config()

// TODO: Initialize Africa's Talking
const africastalking = AfricasTalking({
    apiKey: process.env.AFRICA_API_KEY,
    username: process.env.AFRICA_USERNAME
});


export async function sendSMS(phone: string, message: string) {

    // TODO: Send message
    try {
        const result = await africastalking.SMS.send({
            to: [phone],
            message: message,
            // from: '[Your_sender_ID_goes_here]'
        });
        console.log(result);
    } catch (ex) {
        console.error(ex);
    }
};
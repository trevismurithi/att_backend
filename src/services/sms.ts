const AfricasTalking = require('africastalking');
import axios from 'axios'
import 'dotenv/config'

require('dotenv').config()

// TODO: Initialize Africa's Talking
const africastalking = AfricasTalking({
    apiKey: process.env.AFRICA_API_KEY,
    username: process.env.AFRICA_USERNAME
});


export async function sendATSMS(numbers: any, message: string) {

    // TODO: Send message
    try {
        const result = await africastalking.SMS.send({
            to: numbers,
            message: message,
            // from: '[Your_sender_ID_goes_here]'
        });
        console.log(result);
    } catch (ex) {
        console.error(ex);
    }
};

export async function sendMTSMS(numbers: any, message: string) {
    try {
        const result = await axios.post('https://api.mobitechtechnologies.com/sms/sendbulksms',
            {
                "mobile": numbers,
                "response_type": "json",
                "sender_name": "23107",
                "service_id": 0,
                "message": message
            },
            {
                headers: {
                    h_api_key: process.env.MOBI_API_KEY,
                    "Content-Type": "application/json"
                }
            })
            console.log(result)
    } catch (error) {
        console.error(error)
    }
}
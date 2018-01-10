import { Message } from "../models/Message";

const request = require('request')

export interface IFacebookMessage {
  is_echo: boolean,
  app_id: number,
  mid: string,
  seq: number,
  text: string
}

export const handleMessage = async (sender_psid: string, received_message: IFacebookMessage) => {
  //let response;
  
  if (received_message.text) {
    console.log(`Recived message via Messenager from ${sender_psid} -`, received_message.text)
    
    const message = new Message(received_message.text)
    
    const res = {
      text: JSON.stringify(await message.understand())
    }
    callSendAPI(sender_psid, res)
    //res.send( answer );

    //const response = await bot.ask(received_message.text.toLowerCase())

    //const r = await bot.answer(response)
    //const answer = r ? r : await bot.unclear()

    // const answer = bot.answer(response)
    //   .then( (answer) => {
        // response = {
        //   "text": answer
        // }
    //     callSendAPI(sender_psid, JSON.stringify(response));
    //   });
  }
}

export const callSendAPI = (sender_psid: string, response: { text: string }) => {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  request({
    uri: "https://graph.facebook.com/v2.6/me/messages",
    qs: { "access_token": process.env.facebookPageToken },
    method: "POST",
    json: request_body
  }, (err : Error) => {
    if (!err) {
      console.log(`Send answer via Messenager to ${sender_psid} -`, response.text)
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

export const handlePostback = (sender_psid: string, received_postback: IFacebookMessage) => {
  // let response;
  
  // // Get the payload for the postback
  // let payload = received_postback.payload;

  // // Set the response based on the postback payload
  // if (payload === 'yes') {
  //   response = { "text": "Thanks!" }
  // } else if (payload === 'no') {
  //   response = { "text": "Oops, try sending another image." }
  // }
  // // Send the message to acknowledge the postback
  // callSendAPI(sender_psid, response);
}
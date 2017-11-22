const request = require('request');

const bot = require('./bot');
const secret = require('./secret');

const handleMessage = (sender_psid, received_message) => {
  let response;
  
  // Checks if the message contains text
  if (received_message.text) {    
    bot.ask(received_message.text)
      .then( (response) => {
        response = {
          "text": bot.answer(response)
        }
        callSendAPI(sender_psid, JSON.stringify(response));
      });
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
    // Send the response message
    callSendAPI(sender_psid, response);
  }   
}

const callSendAPI = (sender_psid, response) => {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": secret['facebook']['page-token'] },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!', request_body)
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

const handlePostback = (sender_psid, received_postback) => {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

const facebookMessenager = {
  verify: (req, res, next) => {
    let VERIFY_TOKEN = secret['facebook']['verify-token'];
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.writeHead(200);
        res.write(challenge);
        res.end();
        return;
      } //else {
      //   res.send(403)
      // }
    }
    next();
  },
  handleRequest: (req, res, next) => {
    console.log('handleRequest');
    // Parse the request body from the POST
    if(!req.body) return;
    let body = req.body;
    console.log(body);
      // Check the webhook event is from a Page subscription
      if (body.object === 'page') {
        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {
          // Get the webhook event. entry.messaging is an array, but 
          // will only ever contain one event, so we get index 0
          let webhook_event = entry.messaging[0];
          console.log(webhook_event);

          // Get the sender PSID
          let sender_psid = webhook_event.sender.id;
          console.log('Sender PSID: ' + sender_psid);

          // Check if the event is a message or postback and
          // pass the event to the appropriate handler function
          if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
          } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
          }
        });
        // Return a '200 OK' response to all events
        setTimeout( () => {
          res.send(200, 'EVENT_RECEIVED');        
        }, 2000);
      } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.send(404);
      }
  }
}

module.exports = facebookMessenager;
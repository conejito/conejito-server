import { Request, Response, NextFunction } from "express"
import { Message } from "../models/Message"
import { wit } from "../helpers/wit-ai"
import { IFacebookMessage, handleMessage, callSendAPI, handlePostback } from "../helpers/facebook"

/**
 * GET /webhook
 * Verify Facebook Token.
 */
export const facebookVerify = async (req: Request & { body?: { text: string } }, res: Response, next: NextFunction) => {
  let VERIFY_TOKEN = process.env.facebookToken
  let mode = req.query['hub.mode']
  let token = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED')
      res.writeHead(200)
      res.write(challenge)
      res.end()
      return
    } else {
      res.send(403)
    }
  }
  next()
}

interface IFacebookRequest { 
  object: string,
  entry:[ { id: string, time: number, messaging: [FacebookWebhookEvent] }]
}

type FacebookWebhookEvent = {
  sender: { id: string },
  recipient: { id: string },
  timestamp: number,
  message: IFacebookMessage
}
  
/**
 * POST /webhook
 * Recieve message from Facebook.
 */
export const recieveFacebookMessage = async (req: Request & { body?: IFacebookRequest }, res: Response) => {
  if(!req.body) return
  let body = req.body
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
        // Get the webhook event. entry.messaging is an array, but 
        // will only ever contain one event, so we get index 0
        let webhook_event: FacebookWebhookEvent = entry.messaging[0]
        //console.log(webhook_event);

        // Get the sender PSID
        const sender_psid: string = webhook_event.sender.id
        //console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message)    
        }// else if (webhook_event.postback) {
        //  handlePostback(sender_psid, webhook_event.postback);
        //}
      })
      // Return a '200 OK' response to all events
      setTimeout( () => {
        res.status(200)
        res.send('EVENT_RECEIVED')
      }, 2000)
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.send(404)
    }
}
import { Message } from "../models/Message"
const {Wit, log, interactive} = require('node-wit')

export type Wit = {
  message(message: string, context?: {}): Promise<WitResponse>
}

export type WitResponse = { 
  _text: string, 
  entities: { [key: string]: [ Entity ] }, 
  msg_id: string 
}

export type Entity = {
  confidence: number, 
  value: string, 
  type: string, 
  name: string
}

export const wit: Wit = new Wit({
  accessToken: process.env.witAccessToken
})

export const answer = (message: Message) => {
  
}


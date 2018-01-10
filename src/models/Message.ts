import { Document, Schema, Model, model} from "mongoose";
import { wit, Entity, WitResponse } from "../helpers/wit-ai";

export interface IMessage {
  body: string,
  entities: Array<{}>,
  timestamp: Date
}

export interface IMessageModel extends IMessage, Document {}

const MessageSchema = new Schema({
  body: String,
  entities: [{
    confidence: Number, 
    value: String, 
    type: { type: String }, 
    name: String
  }],
  timestamp: Date
}, { timestamps: true })

export const MessageModel: Model<IMessageModel> = model("Message", MessageSchema)

export class Message implements IMessage {
  private model: IMessageModel

  constructor(body: string) {
    this.model = new MessageModel
    this.model.body = body
  }

  understand() {
    return wit.message(this.body)
    .then( (result: WitResponse) => {
      // Changing object into array of entities (each gets name property based on object keys)
      const entities = Object.keys(result.entities).map((key)=>{
        return result.entities[key].map( (e: Entity) => {
          e.name = key
          return e
        })
      }).reduce((acc, cur) => [...acc, ...cur], [])
      entities.forEach( (e: Entity) => {
        this.model.entities.push(e)
      })
      this.model.save((err : Error) => { if (!err) console.log('Success!') })
      return this
    })
  }

  get body() {
    return this.model.body
  }

  get entities() {
    return this.model.entities
  }

  get timestamp() {
    return this.model.timestamp
  }
}
import * as express from 'express'
import * as mongoose from "mongoose"

import * as bodyParser from 'body-parser'

import { Message } from "./models/message"
import { recieveMessage } from './controllers/message'
import { facebookVerify, recieveFacebookMessage } from './controllers/facebook'

class App {
  public express: express.Application
  public mongoose: mongoose.Mongoose

  constructor () {
    this.express = express()
    this.initMiddlewares()
    this.connectDatabase()

    // var instance = new Message
    // instance.body = 'hello'
    // instance.save()
    // .then( () => console.log('success') )

    this.mountRoutes()
  }

  private initMiddlewares (): void {
    this.express.use(bodyParser.json());
  }

  private connectDatabase (): void {
    this.mongoose = mongoose.connect('mongodb://localhost/conejito')
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', (req : express.Request, res : express.Response) => {
      res.json({
        message: 'Hello World!'
      })
    })
    router.post('/message', recieveMessage)

    router.get('/webhook', facebookVerify)
    router.post('/webhook', recieveFacebookMessage)

    this.express.use('/', router)
  }
}

export default new App().express
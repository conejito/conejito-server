import { Request, Response } from "express"
import { Message } from "../models/Message"
import { wit } from "../helpers/wit-ai"

/**
 * POST /message
 * Recieve simple message.
 */
export const recieveMessage = async (req: Request & { body?: { text: string } }, res: Response) => {
  if (!req.body) return res.sendStatus(400)
  const message = new Message(req.body.text)
  res.json(JSON.stringify(await message.understand()))
}
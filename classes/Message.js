class Message {
  constructor(input) {
    const body = input.q ? input : JSON.parse(input)
    this.q = body.q
  }

  getText() {
    return this.q.toLowerCase();
  }
}

module.exports = Message

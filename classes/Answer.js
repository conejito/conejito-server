class Answer {
  constructor(input) {
    const { intent } = input;
    this._answer = intent.getIntent
      .then()
  }

  getAnswer() {
    return this._answer
  }
}


module.exports = Answer

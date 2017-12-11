const uuid = require('uuid')

class Person {
  constructor(id = uuid.v1()) {
    this.id = id
  }
}

module.exports = Person
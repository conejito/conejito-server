const r = require('rethinkdb');

class RethinkDB {
  constructor(host = 'localhost', port = 28015, database = 'test') {
    this.host = database
    this.port = database
    this.database = database
  }
  connect() {
    return r.connect( {host, port} )
    .then((conn) => {
      this.connection = conn;
      return r.db(database).tableList().run(this.connection)
    })
  }
  createTable(name) {
    if(!this._list.filter(e => e === name).length) {
      return r.db(this.database).tableCreate(name).run(this.connection)
    }
    return new Promise( (res, rej) => { res() } )
  }
}

module.exports = RethinkDB
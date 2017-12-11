const bot = require('../modules/wit-ai');
const database = require('../helpers/database');
const secret = require('../helpers/secret');

module.exports = {
  ask: bot.message,
  answer: (response) => { 
    const entities = Object.keys(response.entities).map((key)=>{
      let entity = response.entities[key][0]
      entity.name = key
      return entity
    }).map(entity => {
      const keyword = entity.value
      return database.simpleAnswer(entity, keyword)
    })
    return Promise.all(entities).then( answer => answer[0] ? answer[0][0] : false )
  },
  unclear: () => {
    const entity = {name: 'smalltalk'}
    const keyword = 'unclear'
    return database.simpleAnswer(entity, keyword).then( answer => answer[0] )
  },
  getEntities: () => {
    return fetch('https://api.wit.ai/entities?v=20170307', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${secret['wit-ai']['accessToken']}`
      })
    }).then( data => data.json() )
  }
};
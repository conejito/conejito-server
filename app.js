const restify = require('restify')
const server = restify.createServer()
const Message = require('./classes/Message')
const Intent = require('./classes/Intent')
const Answer = require('./classes/Answer')

// include helpers
const bot = require('./helpers/bot')
const secret = require('./helpers/secret')
const facebook = require('./helpers/facebook')

const Person = require('./modules/Person')

server.use(restify.plugins.bodyParser())
server.use(restify.plugins.queryParser())

server.use(restify.plugins.requestLogger())

const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
  //preflightMaxAge: 5, //Optional
  origins: ['*'],
  allowHeaders: ['*']
  //allowHeaders: ['API-Token'],
  //exposeHeaders: ['API-Token-Expiry']
})

server.pre(cors.preflight)
server.use(cors.actual)

server.on('uncaughtException', (err) => {
  console.log('============ uncaughtException ============');
  console.log(err);
});

server.get('/webhook', facebook.verify);
server.post('/webhook', facebook.handleRequest);

// handle incoming messages
server.post('/message', async (req, res, next) => {
  req.accepts('application/json');
  const message = new Message(req.body)
  const intent = new Intent(message.getText())
  const answer = new Answer({intent})

  const response = await bot.ask(message)
  const r = await bot.answer(response)
  const answer = r ? r : await bot.unclear()
  console.log(answer[0].Answer);

  const person = new Person(body.sid)
  console.log(person)

  res.send({
    sid: person.id,
    text: answer[0].Answer,
    timestamp: new Date().getTime()
  });
});

// serve static content
server.get('\/.*', restify.plugins.serveStatic({
  'directory': __dirname + '/public',
  'default': 'index.html'
}));

// start server
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

const restify = require('restify');
const server = restify.createServer();

// include helpers
const bot = require('./helpers/bot');
const secret = require('./helpers/secret');
const facebook = require('./helpers/facebook');

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.use(restify.plugins.requestLogger());

// allow cross-origin resource sharing
server.use( (req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return next();
});

server.on('uncaughtException', () => {
  console.log('============ uncaughtException ============');
});

server.get('/webhook', facebook.verify);
server.post('/webhook', facebook.handleRequest);

// handle incoming messages
server.post('/message', async (req, res, next) => {
  req.accepts('application/json');
  const message = req.body.q.toLowerCase();
  const response = await bot.ask(message)
  const r = await bot.answer(response)
  const answer = r ? r : await bot.unclear()
  console.log(answer[0].Answer);
  res.send( answer[0].Answer );
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
const secret = require('./secret');

const facebookMessenager = {
  verify: (req, res, next) => {
    console.log(req.query, secret['facebook']['verify-token']);
    let VERIFY_TOKEN = secret['facebook']['verify-token'];
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.writeHead(200);
        res.write(challenge);
        res.end();
      } else {
        res.send(403)
      }
    } else {
      next();
    }
  }
}

module.exports = facebookMessenager;
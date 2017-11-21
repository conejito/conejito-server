module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : 'conejito-server',
      script    : 'app.js'
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'rafal',
      host : '192.166.218.182',
      ref  : 'origin/master',
      repo : 'https://github.com/conejito/conejito-server.git',
      path : '/var/www/vhosts/conejito',
      'post-deploy' : 'source ~/.profile && npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'rafal',
      host : '192.166.218.182',
      ref  : 'origin/develop',
      repo : 'git@github.com:conejito/conejito-server.git',
      path : '/var/www/vhosts/development',
      'post-deploy' : 'source ~/.profile && npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};

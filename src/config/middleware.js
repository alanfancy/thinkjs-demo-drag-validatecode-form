const path = require('path');
const isDev = think.env === 'development';

module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {
        form: ['application/thinkjs-form'],
        keepExtensions:true,
        uploadDir: path.join(think.ROOT_PATH, 'www/static/runtime/temp/')
    }
  },
  {
    handle: 'router',
    options: {
    }
  },
  'logic',
  'controller'
];

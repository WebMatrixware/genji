'use strict';

require('dotenv').config();

const FSP = require('fs').promises;
const Handlers = require('./handlers.js');
const Hapi = require('@hapi/hapi');
const Path = require('path');
const Pug = require('pug');
const Sass = require('hapi-sass');
const Util = require('./util.js');

let GoodOptions = {};

let SassOptions = {
  src: './html/assets/scss',
  dest: './html/assets/css',
  srcExtension: 'scss',
  routePath: '/assets/css/{file}.css'
}

/* $lab:coverage:off$ */
if(process.env.NODE_ENV === 'test') {
  GoodOptions = {
    ops: {
      interval: 1000
    },
    reporters: {
      consoleReporter: [{
        module: '@hapi/good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', error: '*' }]
      }, {
        module: '@hapi/good-console'
      }, 'stdout']
    }
  };
} else {
  GoodOptions = {
    ops: {
      interval: 1000
    },
    reporters: {
      consoleReporter: [{
        module: '@hapi/good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', response: '*', error: '*', request: '*' }]
      }, {
        module: '@hapi/good-console'
      }, 'stdout']
    }
  };
}
/* $lab:coverage:on$ */

exports.Deployment = async (opts) => {

  const Server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  });

  if (opts.start) {
    await Server.register([{
      plugin: require('@hapi/inert'),
      options: {}
    }, {
      plugin: require('./routes'),
      options: {}
    }, {
      plugin: Sass,
      options: SassOptions
    }, {
      plugin: require('hapi-scope'),
      options: {}
    }, {
      plugin: require('@hapi/vision'),
      options: {}
    }, {
      plugin: require('@hapi/good'),
      options: GoodOptions
    }, {
      plugin: require('akaya'),
      options: {}
    }]);

    await Server.start();
  }

  if (opts.initialize) {
    await Server.register([{
      plugin: require('@hapi/inert'),
      options: {}
    }, {
      plugin: require('./routes'),
      options: {}
    }, {
      plugin: Sass,
      options: SassOptions
    }, {
      plugin: require('@hapi/vision'),
      options: {}
    }, {
      plugin: require('@hapi/good'),
      options: GoodOptions
    }, {
      plugin: require('akaya'),
      options: {}
    }]);

    await Server.initialize();
  }
  
  Server.decorate('request', 'routes', await Util.getRoutes());

  Server.views({
    engines: {
      pug: Pug
    },
    relativeTo: __dirname,
    path: 'html'
  });

  return Server;
};

/* $lab:coverage:off$ */
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
/* $lab:coverage:on$ */

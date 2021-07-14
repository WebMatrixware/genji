'use strict';

const Handlers = require('./handlers.js');
const Joi = require('@hapi/joi');
const Path = require('path');

module.exports = {
  register: async (server, options) => {
    server.route([
      {
        method: 'GET',
        path: '/assets/{path*}',
        handler: {
          directory: {
            path: Path.join(__dirname, 'html', 'assets'),
            listing: false,
            index: false
          }
        },
        options: {
          description: 'Serve static asset files',
          id: 'assetsRoute',
          tags: ['get', 'assets']
        }
      },
      {
        method: 'GET',
        path: '/modules/{path*}',
        handler: {
          directory: {
            path: Path.join(__dirname, 'html', 'node_modules'),
            listing: false,
            index: false
          }
        },
        options: {
          description: 'Serve static module files',
          id: 'modulesRoute',
          tags: ['get', 'modules']
        }
      },
      {
        method: 'GET',
        path: '/{param*}',
        handler: Handlers.manager,
        options: {
          description: 'Route manager for dynamic routes',
          id: 'managerRoute',
          tags: ['get']
        }
      },
      {
        method: 'POST',
        path: '/edit',
        handler: Handlers.writeConfigFile,
        options: {
          description: 'Accept a text body and write it to the config.yml file',
          id: 'writeConfigFile',
          tags: ['post', 'config']
        }
      }
    ]);
  },
  name: 'routes',
  version: '0.1.0'
};

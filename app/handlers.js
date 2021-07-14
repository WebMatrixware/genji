'use strict';

const C = require('chalk');
const FSP = require('fs').promises;
const Path = require('path');
const Util = require('./util.js');

let readConfigFile = async function readConfigFile() {

  return await FSP.readFile(Path.join(__dirname,'config.yml'), 'utf8');
};

exports.manager = async function manager(request, h) {

  let contained = request.routes.contains((r) => {
    return r.path === request.path;
  });
  let destination = request.routes.firstOrDefault((r) => {
    return r.path === request.path;
  }, { path: '/', destination: 'http://0.0.0.0:8585/'}).destination;
  let path = request.path;

  console.log(`contained: ${contained}`);
  console.log(`destination: ${destination}`);
  console.log(`path: ${path}`);

  if (path === '/') {
    return h.view('index');
  } else if (path === '/edit') {
    return h.view('edit');
  } else if (path === '/config') {
    return h.response(await Util.readConfig()).code(200);
  } else if (path === '/configFile') {
    return h.response(await readConfigFile()).code(200);
  } else if (contained) {
    console.log(`${C.redBright('Redirecting')} ${C.underline(path)} to ${C.cyan(destination)}`);
    return h.redirect(destination).code(307);
  } else {
    return h.view('index');
  }
};

exports.writeConfigFile = async function writeConfigFile(request, h) {

  console.log(request.payload);

  let res = await FSP.writeFile(Path.join(__dirname, 'config.yml'), request.payload, {
    flag: 'w'
  });

  console.log(res);

  return h.response('Testing write config file');
};

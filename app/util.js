'use strict';

const FSP = require('fs').promises;
const Linqed = require('linqed');
const YAML = require('js-yaml');
const Path = require('path');

let readConfig = async function readConfig(request, h) {

  let c = '';

  try {
    await FSP.readFile(Path.join(__dirname, 'config.yml'), 'utf8').then((yaml) => {
      c = YAML.load(yaml);
    });
  } catch (err) {
    console.error(err);
  }

  return c;
};

let getRoutes = async function getRoutes(request, h) {

  let r = Linqed([]);
  let base = ['/', '/assets', '/assets/css', '/config', '/modules'];

  let conf = await readConfig();

  r = Linqed(r.concat(base));

  conf.sites.forEach((s) => {
    s.links.forEach((l) => {
      if (!r.contains(l.path)) {
        r.push({ path: l.path, destination: l.destination });
      }
    });
  });

  return r;
};

exports.readConfig = readConfig;
exports.getRoutes = getRoutes;

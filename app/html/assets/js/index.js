'use strict';

let address;

if (env.port === '80') {
  address = `http://${env.host}`;
} else {
  address = `http://${env.host}:${env.port}`;
}

let set = function set(data) {
  if (typeof(data) === 'undefined' || data === null) {
    return '';
  } else {
    return data.toString();
  }
};

let textColor = function textColor(type) {
  if (env.debug) {
    console.log(type);
  }

  if (type === 'primary'
      || type === 'secondary'
      || type === 'success'
      || type === 'danger'
      || type === 'warning'
      || type === 'info'
      || type === 'dark') {
        return `text-light`;
      } else {
        return `text-dark`;
      }
};

let readConfig = async function readConfig() {

  if (env.debug) {
    console.log('readConfig() destination');
    console.log(`${address}/config`);
  }

  await superagent
    .get(`${address}/config`)
    .then((res) => {
      if (env.debug) {
        console.log(res.text);
      }
      vm.config(res.text);
    }).catch((err) => {
      console.error(err);
    });
};

let readConfigFile = async function readConfigFile() {

  if (env.debug) {
    console.log('readConfigFile() destination');
    console.log(`${address}/configFile`);
  }

  await superagent
    .get(`${address}/configFile`)
    .then((res) => {
      if (env.debug) {
        console.log(res.text);
      }
      vm.configFile(res.text);
    }).catch((err) => {
      console.error(err);
    });
};

let loadConfig = async function loadConfig() {

  if (env.debug) {
    console.log(vm.config());
  }

  let c = await JSON.parse(vm.config());

  if (env.debug) {
    console.log(c);
  }

  vm.name(c.name);
  vm.version(c.version);
  vm.editable(env.editable);

  if (typeof(c.alerts) !== 'undefined' && c.alerts !== null) {
    c.alerts.forEach((a) => {
      vm.alerts.push(new appalert({
        type: a.type,
        title: a.title,
        content: a.content
      }));
    });
  }

  if (typeof(c.sites) !== 'undefined' && c.sites !== null) {
    c.sites.forEach((s) => {
      let ns = new site({
        name: s.name,
        type: s.type
      });

      if (typeof(s.links) !== 'undefined' && s.links !== null) {
        s.links.forEach((l) => {
          ns.links.push(new link({
            path: l.path,
            destination: l.destination,
            name: l.name,
            type: l.type
          }));
        });
      }

      if (typeof(s.notes) !== 'undefined' && s.notes !== null) {
        s.notes.forEach((n) => {
          ns.notes.push(new note({
            type: n.type,
            name: n.name,
            content: n.content
          }));
        });
      }

      vm.sites.push(ns);
    });
  }
};

function link(data) {

  let self = this;

  self.path = ko.observable(set(data.path));
  self.destination = ko.observable(set(data.destination));
  self.name = ko.observable(set(data.name));
  self.type = ko.observable(set(data.type));

  self.copyToClipboard = function copyToClipboard() {
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(self.destination()).then(function() {
          console.log(`Wrote "${self.destination()}" to the clipboard`);
        }, function() {
          console.log('Failed to write to the clipboard');
          alert('Failed to write to the clipboard');
        });
      } else {
        console.log('Not allowed to write to clipboard');
        alert('No permission to write to clipboard');
      }
    });
  };

  self.text = ko.computed(function() {
    return `text-${self.type()}`;
  });
}

function site(data) {

  let self = this;

  self.name = ko.observable(set(data.name));
  self.links = ko.observableArray([]);
  self.type = ko.observable(set(data.type || 'primary'));
  self.notes = ko.observableArray([]);

  self.background = ko.computed(function() {
    return `bg-${self.type()}`;
  });
  self.border = ko.computed(function() {
    return `border-${self.type()}`;
  });
  self.text = ko.computed(function() {
    return textColor(self.type());
  });
}

function note(data) {

  let self = this;

  self.type = ko.observable(set(data.type || 'light'));
  self.name = ko.observable(set(data.name));
  self.content = ko.observable(set(data.content));

  self.background = ko.computed(function() {
    return `bg-${self.type()}`;
  });
  self.border = ko.computed(function() {
    return `border-${self.type()}`;
  });
  self.text = ko.computed(function() {
    return textColor(self.type());
  });
}

function appalert(data) {

  let self = this;

  self.type = ko.observable(set(data.type || 'warning'));
  self.title = ko.observable(set(data.title));
  self.content = ko.observable(set(data.content));

  self.background = ko.computed(function() {
    return `alert-${self.type()}`;
  });
  self.border = ko.computed(function() {
    return `border-${self.type()}`;
  });
  self.text = ko.computed(function() {
    return textColor(self.type());
  });
}

function viewModel() {

  let self = this;

  self.address = ko.observable(address);
  self.config = ko.observable('');
  self.configFile = ko.observable('');
  self.name = ko.observable('');
  self.version = ko.observable('');
  self.editable = ko.observable(true);

  self.alerts = ko.observableArray([]);
  self.sites = ko.observableArray([]);

  self.editConfig = function() {
    window.location.href = `${address}/edit`;
  };
  self.saveConfig = async function() {
    await superagent
      .post(`${address}/edit`)
      .set('Content-Type', 'text/plain')
      .send(editor.getValue())
      .then((res) => {
        console.log(res);
      }).catch((err) => {
        console.error(err);
      });
    goBackToMainPage();
  };
  self.cancelEdit = function() {
    goBackToMainPage();
  };

  let goBackToMainPage = function() {
    window.location.href = `${address}`;
  };
};

let vm = new viewModel();
let editor;

ko.applyBindings(vm);

$(document).ready(async function () {

  readConfig().then(() => {
    loadConfig();
  });

  if (window.location.href === `${address}/edit`) {
    await readConfigFile();

    editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night_eighties");
    editor.session.setMode("ace/mode/yaml");
    editor.session.setValue(vm.configFile());
  }
});

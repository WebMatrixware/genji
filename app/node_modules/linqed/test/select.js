'use strict';

const Linqed = require('../src/index.js');
const test = require('ava');

test.beforeEach((t) => {
  
  t.context.basic = Linqed([]);
  t.context.basic[1] = 2;
  t.context.basic[2] = 3;
  t.context.basic[3] = 4;
  t.context.basic[4] = 'Hi';
  t.context.basic[5] = false;
  
  t.context.advanced = Linqed([
    { name: 'Ben', id: 1, role: 'Engineer' },
    { name: 'Rob', id: 2, role: 'CSR' },
    { name: 'Bill', id: 3, role: 'Service Tech' },
    { name: 'Tom', role: 'Owner' },
    { name: 'Stan', id: 4 },
    { name: 'Rick', id: 5, role: 'Service Manager' }
  ]);
});

test('.select() exists', (t) => {
  
  t.truthy(t.context.basic.hasOwnProperty('select'));
});

test('.select() is not enumerable', (t) => {
  
  t.falsy(t.context.basic.propertyIsEnumerable('select'));
});

test('.select() returns an array', (t) => {
  
  t.truthy(Array.isArray(t.context.basic.select()));
});

test('.select() returns the original collection if filter is not a function', (t) => {
  
  t.is(t.context.basic.select(1)[1], 2);
  t.is(t.context.basic.select('Hi')[1], 2);
  t.is(t.context.basic.select(false)[1], 2);
  t.is(t.context.basic.select({})[1], 2);
  t.is(t.context.basic.select(null)[1], 2);
});

test('.select() returns the columns from the original collection as a new Linqed() array if filter is a function', (t) => {
  
  t.is(t.context.advanced.select((item) => {
    return item.id;
  }).length, 6);
  
  t.is(t.context.advanced.select((item) => {
    return item.id;
  })[1], 2);
  
  t.is(t.context.advanced.select((item) => {
    return item.id;
  })[3], undefined);
  
  t.is(t.context.advanced.select((item) => {
    return { id: item.id, job: item.role };
  }).length, 6);
  
  t.is(t.context.advanced.select((item) => {
    return { id: item.id, job: item.role };
  })[0].job, 'Engineer');
  
  t.is(t.context.advanced.select((item) => {
    return { id: item.id, job: item.role };
  })[4].job, undefined);
});

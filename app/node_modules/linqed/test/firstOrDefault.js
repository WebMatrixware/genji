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
    { name: 'Rick', id: 4, role: 'Service Manager' }
  ]);
});

test('.firstOrDefault() exists', (t) => {
  
  t.truthy(t.context.basic.hasOwnProperty('firstOrDefault'));
});

test('.firstOrDefault() is not enumerable', (t) => {
  
  t.falsy(t.context.basic.propertyIsEnumerable('firstOrDefault'));
});

test('.firstOrDefault() returns default if no valid filter is passed', (t) => {
  
  t.is(t.context.basic.firstOrDefault(null, 0), 0);
});

test('.firstOrDefault() retuns index of first matching element or default if not matches when filter is a number', (t) => {
  
  t.is(t.context.basic.firstOrDefault(3, 'stop'), 2);
  t.is(t.context.basic.firstOrDefault(30, 'stop'), 'stop');
});

test('.firstOrDefault() retuns index of first matching element or default if not matches when filter is a string', (t) => {
  
  t.is(t.context.basic.firstOrDefault('Hi', 'stop'), 4);
  t.is(t.context.basic.firstOrDefault('Goodbye', 'stop'), 'stop');
});

test('.firstOrDefault() retuns index of first matching element or default if not matches when filter is a boolean', (t) => {
  
  t.is(t.context.basic.firstOrDefault(false, 'stop'), 5);
  t.is(t.context.basic.firstOrDefault(true, 'stop'), 'stop');
});

test('.firstOrDefault() returns first matching element or default when no matches when filter is a function', (t) => {
  
  t.is(t.context.advanced.firstOrDefault((item) => {
    return (item.id === 2) ? true : false;
  }, 'stop').name, 'Rob');
  
  t.is(t.context.advanced.firstOrDefault((item) => { 
    return (item.id === 5) ? true : false; 
  }, 'stop'), 'stop');
});

test('.firstOrDefault() returns null when filter is an object', (t) => {
  
  t.is(t.context.advanced.firstOrDefault({}, 'stop'), null);
});
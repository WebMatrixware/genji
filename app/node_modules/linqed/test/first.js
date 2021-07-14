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

test('.first() exists', (t) => {
  
  t.truthy(t.context.basic.hasOwnProperty('first'));
});

test('.first() is not enumerable', (t) => {
  
  t.falsy(t.context.basic.propertyIsEnumerable('first'));
});

test('.first() returns first populated element if no filter is passed', (t) => {
  
  t.is(t.context.basic.first(), 2);
});

test('.first() returns index of first matching element or -1 if no matches when filter is a number', (t) => {
  
  t.is(t.context.basic.first(3), 2);
  t.is(t.context.basic.first(30), -1);
});

test('.first() returns index of first matching element or -1 if no matches when filter is a string', (t) => {
  
  t.is(t.context.basic.first('Hi'), 4);
  t.is(t.context.basic.first('Goodbye'), -1);
});

test('.first() returns index of first matching element or -1 if no matches when filter is a boolean', (t) => {
  
  t.is(t.context.basic.first(false), 5);
  t.is(t.context.basic.first(true), -1);
});

test('.first() returns first matching element or null when no matches when filter is a function', (t) => {

  t.is(t.context.advanced.first((item) => { 
    return (item.id === 2) ? true : false; 
  }).name, 'Rob');
  
  t.is(t.context.advanced.first((item) => { 
    return (item.id === 5) ? true : false; 
  }), null);
});

test('.first() returns null when filter is an object', (t) => {
  
  t.is(t.context.advanced.first({}), null);
});
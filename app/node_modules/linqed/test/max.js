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
  
  t.context.number = Linqed([1, 1, 1, 1]);
  t.context.string = Linqed(['hi', 'hi', 'hi', 'hi']);
  t.context.boolean = Linqed([true, true, true, true]);
  
  t.context.advanced = Linqed([
    { name: 'Ben', id: 1, role: 'Engineer' },
    { name: 'Rob', id: 2, role: 'CSR' },
    { name: 'Bill', id: 3, role: 'Service Tech' },
    { name: 'Tom', role: 'Owner' },
    { name: 'Stan', id: 4 },
    { name: 'Rick', id: 5, role: 'Service Manager' }
  ]);
});

test('.max() exists', (t) => {
  
  t.truthy(t.context.basic.hasOwnProperty('max'));
});

test('.max() is not enumerable', (t) => {
  
  t.falsy(t.context.basic.propertyIsEnumerable('max'));
});

test('.max() returns the largest numerical root value from collection or -1 if there are no numerical root values', (t) => {
  
  t.is(t.context.basic.max(), 4);
  t.is(t.context.string.max(), -1);
  t.is(t.context.number.max(null), 1);
});

test('.max() returns the largest numerical value based on filter function or -1 if there are no numerical values', (t) => {
  
  t.is(t.context.basic.max((item) => {
    return (typeof(item) === 'string') ? item.length : -1;
  }), 2);
  t.is(t.context.advanced.max((item) => {
    return (typeof(item.id) === 'number') ? item.id : -1;
  }), 5);
});

test('.max() returns -1 when invalid filters are passed in', (t) => {
  
  t.is(t.context.basic.max(1), -1);
  t.is(t.context.basic.max('Hi'), -1);
  t.is(t.context.basic.max(false), -1);
  t.is(t.context.basic.max({}), -1);
});
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

test('.min() exists', (t) => {
  
  t.truthy(t.context.basic.hasOwnProperty('min'));
});

test('.min() is not enumerable', (t) => {
  
  t.falsy(t.context.basic.propertyIsEnumerable('min'));
});

test('.min() returns the smallest numerical root value from collection or -1 if there are no numerical root values', (t) => {
  
  t.is(t.context.basic.min(), 2);
  t.is(t.context.string.min(), Infinity);
  t.is(t.context.number.min(null), 1);
});

test('.min() returns the smallest numerical value based on filter function or -1 if there are no numerical values', (t) => {
  
  t.is(t.context.basic.min((item) => {
    return (typeof(item) === 'string') ? item.length : Infinity;
  }), 2);
  t.is(t.context.advanced.min((item) => {
    return (typeof(item.id) === 'number') ? item.id : Infinity;
  }), 1);
});

test('.min() returns -1 when invalid filters are passed in', (t) => {
  
  t.is(t.context.basic.min(1), Infinity);
  t.is(t.context.basic.min('Hi'), Infinity);
  t.is(t.context.basic.min(false), Infinity);
  t.is(t.context.basic.min({}), Infinity);
});
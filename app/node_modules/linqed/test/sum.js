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

test('.sum() exists', (t) => {
  
  t.truthy(t.context.basic.hasOwnProperty('sum'));
});

test('.sum() is not enumerable', (t) => {
  
  t.falsy(t.context.basic.propertyIsEnumerable('sum'));
});

test('.sum() returns the computed value of numerical root elements when no filter is provided', (t) => {
  
  t.is(t.context.basic.sum(), 9);
  t.is(t.context.number.sum(), 4);
  t.is(t.context.string.sum(), -1);
});

test('.sum() returns the computed value based on provided function for a filter', (t) => {
  
  t.is(t.context.basic.sum((item) => {
    return (typeof(item) === 'number') ? item + 2 : null;
  }), 15);
  t.is(t.context.advanced.sum((item) => {
    return (typeof(item.id) === 'number') ? item.id : null;
  }), 15);
  t.is(t.context.advanced.sum((item) => {
    return (typeof(item.name.length) === 'number') ? item.name.length : null;
  }), 21);
});

test('.sum() returns -1 if an invalid filter is provided', (t) => {
  
  t.is(t.context.basic.sum(1), -1);
  t.is(t.context.basic.sum('a'), -1);
  t.is(t.context.basic.sum(false), -1);
  t.is(t.context.basic.sum({}), -1);
});
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

test('.average() exists', (t) => {
  
  t.truthy(t.context.basic.hasOwnProperty('average'));
});

test('.average() is not enumerable', (t) => {
  
  t.falsy(t.context.basic.propertyIsEnumerable('average'));
});

test('.average() returns the average of numerical root elements of the collection when no valid filter is provided', (t) => {
  
  t.is(t.context.basic.average(), 3);
  t.is(t.context.number.average(), 1);
  t.is(t.context.string.average(), 0);
  t.is(t.context.advanced.average(), 0);
});

test('.average() returns the average of numerical elements of the collection based on the provided filter', (t) => {
  
  t.is(t.context.basic.average((item) => {
    return (typeof(item) === 'number') ? item + 1 : -1;
  }), 4);
  t.is(t.context.number.average((item) => {
    return (typeof(item) === 'number') ? item + 1 : -1;
  }), 2);
  t.is(t.context.string.average((item) => {
    return (typeof(item) === 'number') ? item + 5 : -1;
  }), 0);
  t.is(t.context.advanced.average((item) => {
    return (typeof(item.id) === 'number') ? item.id : -1;
  }), 3);
});

test('.average() returns -1 when a non-valid filter is passed in', (t) => {
  
  t.is(t.context.basic.average(1), -1);
  t.is(t.context.basic.average('test'), -1);
  t.is(t.context.basic.average(true), -1);
  t.is(t.context.basic.average({}), -1);
})
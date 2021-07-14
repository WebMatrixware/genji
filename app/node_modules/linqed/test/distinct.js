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
    { name: 'Rick', id: 5, role: 'Service Manager' },
    { name: 'Keith', id: 5, role: 'Owner' }
  ]);
});

test('.distinct() exists', (t) => {
  
  t.truthy(t.context.basic.hasOwnProperty('distinct'));
});

test('.distinct() is not enumerable', (t) => {
  
  t.falsy(t.context.basic.propertyIsEnumerable('distinct'));
});

test('.distinct() returns an array', (t) => {
  
  t.truthy(Array.isArray(t.context.basic.distinct()));
});

test('.distinct() returns an array of distinct collection elements with no filter', (t) => {
  
  t.is(t.context.basic.distinct().length, 5);
  t.is(t.context.number.distinct().length, 1);
  t.is(t.context.string.distinct().length, 1);
  t.is(t.context.boolean.distinct().length, 1);
  t.is(Linqed([]).distinct().length, 0);
});

test('.distinct() returns an array of distinct collection elements based on their property of the provided string name', (t) => {
  
  t.is(t.context.basic.distinct('id').length, 0);
  t.is(t.context.advanced.distinct('name').length, 7);
  t.is(t.context.advanced.distinct('id').length, 5);
});

test('.distinct() returns an array of distinct collection elements based on a filter function', (t) => {
  
  t.is(t.context.advanced.distinct((item) => {
    return (typeof(item.id) === 'number') ? item.id : null;
  }).length, 5);
});
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
  t.context.basic[6] = null;
  
  t.context.number = Linqed([1, 1, 1, 1]);
  t.context.string = Linqed(['hi', 'hi', 'hi', 'hi', 'bye']);
  t.context.boolean = Linqed([true, true, true, true, false]);
  
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

test('.except() exists', (t) => {
  
  t.truthy(t.context.basic.hasOwnProperty('except'));
});

test('.except() is not enumerable', (t) => {
  
  t.falsy(t.context.basic.propertyIsEnumerable('except'));
});

test('.except() returns original collection with no filter', (t) => {
  
  t.is(t.context.basic.except().length, 5);
});

test('.except() returns collection values not matched', (t) => {
  
  t.is(t.context.basic.except(2).length, 2);
  t.is(t.context.string.except('hi').length, 1);
  t.is(t.context.boolean.except(true).length, 1);
  t.is(t.context.basic.except(null).length, 5);
});

test('.except() returns collection of values not matched by filter', (t) => {
  
  t.is(t.context.advanced.except((item) => {
    return (item.id === 2 || item.id === 3) ? false : true;
  }).length, 5);
});

test('.except() returns collection of items not in filter array', (t) => {
  
  t.is(t.context.basic.except(Linqed([2, false])).length, 4);
});
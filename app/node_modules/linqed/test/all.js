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

test('.all() exists', (t) => {
  
  t.truthy(t.context.basic.hasOwnProperty('all'));
});

test('.all() is not enumerable', (t) => {
  
  t.falsy(t.context.basic.propertyIsEnumerable('all'));
});

test('.all() with no filter returns false', (t) => {
  
  t.is(t.context.basic.all(), false);
});

test('.all() with a filter of type number returns true if all elements of the collection equal that number otherwise false', (t) => {
  
  t.is(t.context.number.all(1), true);
  t.is(t.context.basic.all(2), false);
});

test('.all() with a filter of type string returns true if all elements of the collection equal that string otherwise false', (t) => {
  
  t.is(t.context.string.all('hi'), true);
  t.is(t.context.basic.all('Hi'), false);
});

test('.all() with a filter of type boolean returns true if all elements of the collection equal that boolean otherwise false', (t) => {
  
  t.is(t.context.boolean.all(true), true);
  t.is(t.context.basic.all(false), false);
});

test('.all() with a filter function returns true if all elements evaluate to true from the function otherwise false', (t) => {
  
  t.is(t.context.advanced.all((item) => {
    return (typeof(item.name) === 'string' && item.name !== '') ? true : false;
  }), true);
  
  t.is(t.context.advanced.all((item) => {
    return (typeof(item.role) === 'string' && item.role !== '') ? true : false;
  }), false);
});
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

test('.intersect() exists', (t) => {

  t.truthy(t.context.basic.hasOwnProperty('intersect'));
});

test('.intersect() is not enumerable', (t) => {

  t.falsy(t.context.basic.propertyIsEnumerable('intersect'));
});

test('.intersect() returns empty collection with no filter', (t) => {

  t.is(t.context.number.intersect().length, 0);
});

test('.intersect() returns merged colleciton with only distinct elements with filterArray', (t) => {

  t.is(t.context.basic.intersect(Linqed([2, 3, 7, 8, 9, 'boo'])).length, 10);
});

test('.intersect() treats single filter items as 1 cell array', (t) => {

  t.is(t.context.basic.intersect(5).length, 7);
  t.is(t.context.number.intersect('boo').length, 5);
  t.is(t.context.string.intersect(true).length, 6);
  t.is(t.context.advanced.intersect({}).length, 8);
  t.is(t.context.boolean.intersect(true).length, 5);
});

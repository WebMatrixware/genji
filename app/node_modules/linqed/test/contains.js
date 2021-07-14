'use strict';

const Linqed = require('../src/index.js');
const test = require('ava');

test.beforeEach((t) => {

  t.context = Linqed([1, 2, 3, 4]);
});

test('.contains() exists', (t) => {

  t.truthy(t.context.hasOwnProperty('contains'));
});

test('.contains() is not enumerable', (t) => {

  t.falsy(t.context.propertyIsEnumerable('contains'));
});

test('.contains() with no filter returns true for non-empty array', (t) => {

  t.truthy(t.context.contains());
});

test('.contains() with no filter returns fase for empty array', (t) => {

  let emptyTestArray = Linqed([]);

  t.falsy(emptyTestArray.contains());
});

test('.contains() with string or number returns true if it is a member of the array', (t) => {

  t.truthy(t.context.contains(1));
});

test('.contains() with a string or number returns false if it is not a member of the array', (t) => {

  t.falsy(t.context.contains(5));
});

test('.contain() can handle objects with properties', (t) => {

  let testArray = Linqed([
    { name: 'Ben', id: 1, car: 'Versa Note' },
    { name: 'Dale', id: 2, car: 'Versa' },
    { name: 'Bill', id: 3, car: 'Versa Note' },
    { name: 'Rob', id: 4 }
  ]);

  t.truthy(testArray.contains((item) => { if (item.id === 1) return item; }));
  t.falsy(testArray.contains((item) => { if (item.id === 5) return item; }));
});

'use strict';

const Linqed = require('../src/index.js');
const test = require('ava');

test.beforeEach((t) => {
  
  t.context = Linqed([1, 2, 3, 4]);
});

test('.where() exists', (t) => {
  
  t.truthy(t.context.hasOwnProperty('where'));
});

test('.where() returns an array', (t) => {
  
  t.truthy(Array.isArray(t.context.where((item) => { return item; })));
});

test('.where((item) => { if (item === 1) return item } returns 1 element)', (t) => {
  
  t.is(t.context.where((item) => { if (item === 1) return item; }).length, 1);
});

test('.where((item) => { if (item !== 1) return item } returns 3 elements)', (t) => {
  
  t.is(t.context.where((item) => { if (item !== 1) return item; }).length, 3);
});

test('.where() can handle objects with properties', (t) => {
  
  let testArray = Linqed([
    { name: 'Ben', age: 36, gender: 'm' },
    { name: 'Kiersten', age: 33, gender: 'f' },
    { name: 'Tim', age: 12, gender: 'm' },
    { name: 'Hanna', age: 11, gender: 'f' },
    { name: 'Chloe', age: 9, gender: 'f' },
    { name: 'Levi', age: 7, gender: 'm' },
    { name: 'Noah', age: 3, gender: 'm' },
    { name: 'Ava', age: 2, gender: 'f' }
  ]);
  
  t.is(testArray.where((item) => {
    if (item.gender === 'm') {
      return item
    }
  }).length, 4);
});

test('.where() returns the array unaltered if there is no valid filter function', (t) => {
  
  t.is(t.context.where().length, t.context.length);
  t.is(t.context.where(1).length, t.context.length);
  t.is(t.context.where({}).length, t.context.length);
  t.is(t.context.where('a').length, t.context.length);
});

test('.where() is not enumerable', (t) => {
  
  t.falsy(t.context.propertyIsEnumerable('where'));
});
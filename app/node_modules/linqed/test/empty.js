'use strict';

const Linqed = require('../src/index.js');
const test = require('ava');

test.beforeEach((t) => {
  
  t.context = Linqed([1, 2, 3, 4]);
});

test('.empty() exists', (t) => {
  
  t.truthy(t.context.hasOwnProperty('empty'));
});

test('.empty() returns an array', (t) => {
  
  t.truthy(Array.isArray(t.context.empty()));
});

test('.empty() return array has 0 length', (t) => {
  
  t.is(t.context.length, 4);
  t.is(t.context.empty().length, 0);
});

test('.empty() is not enumerable', (t) => {
  
  t.falsy(t.context.propertyIsEnumerable('empty'));
});
'use strict';

const Linqed = require('../src/index.js');
const test = require('ava');

test.beforeEach((t) => {
  
  t.context = Linqed([1, 2, 3, 4]);
});

test('linqed should return an array', (t) => {
   
  t.truthy(Array.isArray(t.context));
});
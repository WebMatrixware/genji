'use strict';

const Linqed = require('../src/index.js');
const test = require('ava');

test.beforeEach((t) => {
  
  t.context.inner = Linqed([
    { name: 'Ben', id: 1, car: 'Versa Note' },
    { name: 'Dale', id: 2, car: 'Versa' },
    { name: 'Bill', id: 3, car: 'Versa Note' },
    { name: 'Rob', id: 4 }
  ]);
  
  t.context.outer = Linqed([
    { id: 1, department: 'Installation' },
    { id: 3, department: 'Service' },
    { id: 4, department: 'CSR' }
  ]);
});

test('.join() exists', (t) => {
  
  t.truthy(t.context.inner.hasOwnProperty('join'));
});

test('.join() is not enumerable', (t) => {
  
  t.falsy(t.context.inner.propertyIsEnumerable('join'));
});

test('.join() returns the collection unaltered if there is no outer array or valid filter provided', (t) => {
  
  t.is(t.context.inner.join()[0].name, 'Ben');
  t.falsy(t.context.inner.join()[0].hasOwnProperty('department'));
  t.falsy(t.context.inner.join(t.context.outer, null)[0].hasOwnProperty('department'));
  t.falsy(t.context.inner.join(t.context.outer, 1)[0].hasOwnProperty('department'));
});

test('.join() returns a merged collection if a string filter is passed', (t) => {
  
  t.is(t.context.inner.join(t.context.outer, 'id')[0].department, 'Installation');
});

test('.join() returns a merged collection if no filter is passed, but the objects in both arrays have an id property', (t) => {
  
  t.is(t.context.inner.join(t.context.outer)[0].department, 'Installation');
});

test('.join() returns a merged collection based on a function filter', (t) => {
  
  t.is(t.context.inner.join(t.context.outer, (i) => {
    return (typeof(i.id) !== 'undefined') ? i.id : null;
  })[0].department, 'Installation');
});
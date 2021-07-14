<a name="linqed"></a>

## linqed(array) ⇒ <code>collection</code>
Base constructor for linqed library

**Kind**: global function  
**Returns**: <code>collection</code> - array with linqed collection interface added on top  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | The array to convert into a linqed collection |

**Example** *(Create a new linqed collection)*  
```js
// returns a linqed collection
let collection = linqed([]);
```

* [linqed(array)](#linqed) ⇒ <code>collection</code>
    * [.all(filter)](#linqed+all) ⇒ <code>boolean</code>
    * [.average(filter)](#linqed+average) ⇒ <code>number</code>
    * [.contains(filter)](#linqed+contains) ⇒ <code>boolean</code>
    * [.distinct(filter)](#linqed+distinct) ⇒ <code>collection</code>
    * [.empty()](#linqed+empty) ⇒ <code>collection</code>
    * [.except(filter)](#linqed+except) ⇒ <code>collection</code>
    * [.first(filter)](#linqed+first) ⇒ <code>any</code>
    * [.firstOrDefault(filter, default)](#linqed+firstOrDefault) ⇒ <code>any</code>
    * [.intersect(filterCollection)](#linqed+intersect) ⇒ <code>collection</code>
    * [.join(outer, filter)](#linqed+join) ⇒ <code>collection</code>
    * [.max(filter)](#linqed+max) ⇒ <code>number</code>
    * [.min(filter)](#linqed+min) ⇒ <code>number</code>
    * [.select(filter)](#linqed+select) ⇒ <code>collection</code>
    * [.sum(filter)](#linqed+sum) ⇒ <code>number</code>
    * [.where(filter)](#linqed+where) ⇒ <code>collection</code>

<a name="linqed+all"></a>

### linqed.all(filter) ⇒ <code>boolean</code>
Determine if all elements in a collection match a given filter

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>boolean</code> - true if all elements match the filter, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>null</code> \| <code>number</code> \| <code>string</code> \| <code>boolean</code> \| <code>function</code> | The filter to test against each element of the collection |

**Example** *(.all() with no filter)*  
```js
// Returns false with no filter specified
let status = linqed([1, 2, 3, 4]).all(); // false
```
**Example** *(.all() with number filter)*  
```js
// Returns true if all elements match, false otherwise
let status = linqed([1, 1, 1, 1]).all(1); // true
status = linqed([1, 1, 1, 2]).all(1); // false
```
**Example** *(.all() with function filter)*  
```js
// Returns true if the provided function returns true for each element, otherwise false
let collection = linqed([
  { name: 'Bob', id: 1, member: true },
  { name: 'Bob', id: 2, member: true },
  { name: 'Jeff', id: 3, member: true }
]);

let status = collection.all((item) => {
  return item.member;
}); // true

status = collection.all((item) => {
  return (item.name === 'Bob') ? true : false;
}); //false
```
<a name="linqed+average"></a>

### linqed.average(filter) ⇒ <code>number</code>
Determine the arithmetic average of all members of a collection and return it

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>number</code> - the arithmetic average or -1 if it cannot be calculated or an invalid filter is provided  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>null</code> \| <code>function</code> | The filter to determine how to calculate the average |

**Example** *(.average() with no filter)*  
```js
// Returns the average of all root elements with a numeric value in collection
// Notice that it ignores all elements with non-numeric root values
let avg = linqed([1, 3, 'a', null, 5, 7, true]).average(); // 4
```
**Example** *(.average() with function for filter)*  
```js
// Returns the average of all values returned from your filter function that do not equal -1. Use this to indicate elements you do not want to include in the average.
let avg = linqed([
  { name: 'Bob', age: 20 },
  { name: 'Jeff', age: 40 },
  { name: 'Leo', age: 60 }
]).average((item) => {
  return (typeof(item.age) === 'number') ? item.age : -1;
}); // 40
```
<a name="linqed+contains"></a>

### linqed.contains(filter) ⇒ <code>boolean</code>
Determine if the filter value is contained in the collection

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>boolean</code> - true if any element matches the filter, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>null</code> \| <code>number</code> \| <code>string</code> \| <code>boolean</code> \| <code>function</code> | The filter to test if it exists in your collection |

**Example** *(.contains() with null/empty filter)*  
```js
// Returns false if the array is empty, true otherwise
let exists = linqed([
]).contains(); // false
```
**Example** *(.contains() with function filter)*  
```js
// Returns true if your filter returns true for any element in the collection, otherwise false
let exists = linqed([
  { name: 'Bob', age: 20 },
  { name: 'Jeff', age: 40 },
  { name: 'Leo', age: 60 }
]).contains((item) => {
  return (item.name === 'Leo') ? true : false;
}); // true
```
**Example** *(.contains() with base type filter)*  
```js
// Returns true if the filter strictly matches any element in the collection, otherwise false
let exists = linqed([1, 3, 'a', true, false, 'f', 8]).contains(9); // false
```
<a name="linqed+distinct"></a>

### linqed.distinct(filter) ⇒ <code>collection</code>
Return a de-duplicated collection based on a filter if provided

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>collection</code> - linqed collection  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>null</code> \| <code>string</code> \| <code>function</code> | The object property to diferentiate on |

**Example** *(.distinct() with no filter)*  
```js
// Return a deduplicated collection, note that comparison is strict (===)
let deduped = linqed([1, 1, 3, 5, 5, 'a', 'a', { a: 1, b: 2}, { a: 1, b: 2}]).distinct();
// [
// 1,
// 3,
// 5,
// 'a',
// { a: 1, b: 2 }
//]
```
**Example** *(.distinct() with string filter)*  
```js
// Return a deduplicated collection based on a string filter
let deduped = linqed([{ a: 1, b: 2}, { a: 1, b: 2}, { a: 3, b: 2}, { a: 3, b: 2}]).distinct('a');
// [
// { a: 1, b: 2 },
// { a: 3, b: 2 }
//]
```
**Example** *(.distinct() with function filter)*  
```js
// Return a deduplicated collection based on a function filter
let deduped = linqed([
  { a: 1, b: 1},
  { a: 1, b: 2},
  { a: 3, b: 2},
  { a: 3, b: 4}]).distinct((item) => {
  return (tyepeof(item.b) === 'number') ? item.b : null;
});
// [
// { a: 1, b: 1 },
// { a: 1, b: 2 },
// { a: 3, b: 4 }
//]
```
<a name="linqed+empty"></a>

### linqed.empty() ⇒ <code>collection</code>
Rturn an empty collection

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>collection</code> - linqed collection  
<a name="linqed+except"></a>

### linqed.except(filter) ⇒ <code>collection</code>
Return a collection with all members except those that match a filter

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>collection</code> - linqed collection  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>null</code> \| <code>number</code> \| <code>string</code> \| <code>boolean</code> \| <code>function</code> \| <code>array</code> | The value or collection to remove before returning the collection |

**Example** *(.except() without filter param)*  
```js
// Return the collection with null elements removed
let collection = linqed([
  null,
  1,
  'a',
  null
]).except(); // [1, 'a']
```
**Example** *(.except() with number / string / boolean filter)*  
```js
// Return the collection with matching elements removed
let collection = linqed([
  1,
  2,
  3,
  4,
  5,
  'a'
]).except(4); // [1, 2, 3, 5, 'a']
```
**Example** *(.except() with array filter)*  
```js
// Return the collection with all elements in the filter array removed
let collection = linqed([
  1,
  2,
  3,
  4,
  5,
  'a'
]).except([1, 2, 'a']); // [3, 4, 5]
```
**Example** *(.except() with function filter)*  
```js
// Return the collection with all elements removed based on the filter function
let collection = linqed([
  1,
  2,
  3,
  4,
  5,
  'a'
]).except((item) => {
  return (item !== 2 && item !== 5) ? true : false;
}); // [1, 3, 4, 'a']
```
<a name="linqed+first"></a>

### linqed.first(filter) ⇒ <code>any</code>
Return the first element of the collection that matches the provided filter or null if no match is found

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>any</code> - The element of the collection that is the first match to your provided filter or null if no match is found  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>null</code> \| <code>number</code> \| <code>string</code> \| <code>boolean</code> \| <code>function</code> | The filter to determine which element is returned |

**Example** *(.first() with no filter)*  
```js
// Return the first non-null element of the collection
let value = linqed([null, null, 1, 3, 5]).first(); // 1
```
**Example** *(.first() with base type filter (number, string, boolean))*  
```js
// Return the first element that strictly matches the filter provided
let value = linqed([null, 1, 'a', true, false, 6, 6, 7]).first(6); // 6
```
**Example** *(.first() with function filter)*  
```js
// Return the first element where your provided filter function returns true
let value = linqed([
  { name: 'Bob', age: 20 },
  { name: 'Jeff', age: 40 },
  { name: 'Leo', age: 60 }
]).first((item) => {
  return (item.age > 30) ? true : false;
}); // { name: 'Jeff', age: 40 }
```
<a name="linqed+firstOrDefault"></a>

### linqed.firstOrDefault(filter, default) ⇒ <code>any</code>
Return the first element of the collection that matches the provided filter or a default value if no match is found

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>any</code> - The element of the collection that is the first match to your provided filter or your default if no match is found  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>null</code> \| <code>number</code> \| <code>string</code> \| <code>boolean</code> \| <code>function</code> | The filter to determine which element is returned |
| default | <code>any</code> | The default value to return if no match is found based on the filter provided |

**Example** *(.firstOrDefault() with no filter)*  
```js
// Return the default when no valid filter is provided
let value = linqed([null, null, 1, 3, 5]).firstOrDefault(null, 8); // 8
```
**Example** *(.firstOrDefault() with base type filter (number, string, boolean))*  
```js
// Return the first element that strictly matches the filter provided or default if no match
let value = linqed([null, 1, 'a', true, false, 6, 6, 7]).first(6, 10); // 6
```
**Example** *(.firstOrDefault() with function filter)*  
```js
// Return the first element where your provided filter function returns true or the default
let value = linqed([
  { name: 'Bob', age: 20 },
  { name: 'Jeff', age: 40 },
  { name: 'Leo', age: 60 }
]).first((item) => {
  return (item.age > 65) ? true : false;
}, 8); // 8
```
<a name="linqed+intersect"></a>

### linqed.intersect(filterCollection) ⇒ <code>collection</code>
Returns the subset of the collection that is also part of your filter collection

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>collection</code> - The collection of values common to the base collection and the filter provided  

| Param | Type | Description |
| --- | --- | --- |
| filterCollection | <code>collection</code> \| <code>array</code> \| <code>number</code> \| <code>string</code> \| <code>boolean</code> \| <code>object</code> | The collection or value to filter with |

**Example** *(.intersect() with no filter)*  
```js
// Return an empty collection
let collection = linqed([1, 2, 3, 4, 5]).intersect(); // []
```
**Example** *(.intersect() with a collection as filter)*  
```js
// Return a collection of elements that are common to the base collection and the filter collection
let collection = linqed([1, 2, 3, 4, 5, 6]).intersect(linqed([3, 4, 5, 7, 8])); // [3, 4, 5]
```
**Example** *(.intersect() with a single value)*  
```js
// Filters that are not arrays or collections are treated as single element collections
let collection = linqed([1, 2, 3, 4, 5, 6]).intersect(6); // [6]
```
**Example** *(.intersect() with a filter that has no common elements)*  
```js
// Where no common elements are found an empty collection is returned
let collection = linqed([1, 2, 3, 4, 5, 6]).intersect(10); // []
```
<a name="linqed+join"></a>

### linqed.join(outer, filter) ⇒ <code>collection</code>
Returns a merged collection based on matching the specified filter property. Assumes property named id if no filter is specified.

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>collection</code> - The merged collection that results from joining the inner (base) collection and the provided outer function.  

| Param | Type | Description |
| --- | --- | --- |
| outer | <code>collection</code> \| <code>array</code> | Collection to use as the outer member of an standard inner join |
| filter | <code>string</code> \| <code>function</code> | Either a property name to match on, or a function that does the matching for us and returns the value of an object to match on. |

**Example** *(.join() with no default id matching)*  
```js
// With a valid outer collection but no filter .join() assumes
// that the objects of both arrays have an 'id' property
let joined = linqed([
  { name: 'Jeff', id: 1 },
  { name: 'Rick', id: 2 },
  { name: 'John', id: 3 }
]).join(linqed([
  { city: 'Atlanta', id: 1 },
  { city: 'Salem', id: 2 },
  { city: 'New York', id: 3 }
]));
console.log(joined);
//[
//  { name: 'Jeff', id: 1, city: 'Atlanta' },
//  { name: 'Rick', id: 2, city: 'Salem' },
//  { name: 'John', id: 3, city: 'New York' }
//]
```
**Example** *(.join() with string filter)*  
```js
// With a valid outer collection and a string filter .join()
// will merge the collections based on matching properties
// with your string filter for a name
let joined = linqed([
  { name: 'Jeff', id: 1 },
  { name: 'Rick', id: 2 },
  { name: 'John', id: 3 }
]).join(linqed([
  { city: 'Atlanta', id: 1 },
  { city: 'Salem', id: 2 },
  { city: 'New York', id: 3 }
]), 'id');
console.log(joined);
//[
//  { name: 'Jeff', id: 1, city: 'Atlanta' },
//  { name: 'Rick', id: 2, city: 'Salem' },
//  { name: 'John', id: 3, city: 'New York' }
//]
```
**Example** *(.join() with a function filter)*  
```js
// With a valid outer collection and a function to return the
// value to match collection objects on
let joined = linqed([
  { name: 'Jeff', id: 1 },
  { name: 'Rick', id: 2 },
  { name: 'John', id: 3 }
]).join(linqed([
  { city: 'Atlanta', id: 1 },
  { city: 'Salem', id: 2 },
  { city: 'New York', id: 3 }
]), (item) => {
  return (typeof(item.id) === number) ? item.id : null;
});
console.log(joined);
//[
//  { name: 'Jeff', id: 1, city: 'Atlanta' },
//  { name: 'Rick', id: 2, city: 'Salem' },
//  { name: 'John', id: 3, city: 'New York' }
//]
```
<a name="linqed+max"></a>

### linqed.max(filter) ⇒ <code>number</code>
Return the largest numerical value of the collection

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>number</code> - The largest numerical value from a collection, or -1 if none can be identified.  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>null</code> \| <code>function</code> | The filter function to determine how to compare elements if needed |

**Example** *(.max() with no filter provided)*  
```js
// Returns the value of the largest element with a root numerical value
let biggest = linqed(['a', null, true, 5, 'thirteen', 2]).max(); // 5
```
**Example** *(.max() with filter function)*  
```js
// Return the largest element baesd on numberical values provided by your filter function
let biggest = linqed([
  { name: 'Tom', age: 40 },
  { name: 'Rick', age: 41 },
  { name: 'Stan', age: 35 },
  { name: 'Bill', age: 32 }
]).max((item) => {
  return (typeof(item.age) === 'number') ? item.age : -1;
}); // 41
```
<a name="linqed+min"></a>

### linqed.min(filter) ⇒ <code>number</code>
Return the smallest numerical value of the collection

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>number</code> - The smallest numerical value from a collection, or Infinity if none can be identified.  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>null</code> \| <code>function</code> | The filter function to determine how to compare elements if needed |

**Example** *(.min() with no filter provided)*  
```js
// Returns the value of the smallest element with a root numerical value
let smallest = linqed(['a', null, true, 5, 'thirteen', 2]).min(); // 2
```
**Example** *(.min() with filter function)*  
```js
// Return the smallest element baesd on numberical values provided by your filter function
let smallest = linqed([
  { name: 'Tom', age: 40 },
  { name: 'Rick', age: 41 },
  { name: 'Stan', age: 35 },
  { name: 'Bill', age: 32 }
]).min((item) => {
  return (typeof(item.age) === 'number') ? item.age : Infinity;
}); // 32
```
<a name="linqed+select"></a>

### linqed.select(filter) ⇒ <code>collection</code>
Return a collection with elements determined by the filter function provided. NOTE: .select() allows you to control what parts of each object in a collection are returned, but all elements are returned. To limit which elements are returned use .where().

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>collection</code> - The collection of selected properties for each element  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>function</code> | The function that determins what part of each element is returned in the new collection |

**Example**  
```js
// Return the name and age attributes of each elementlet collection = linqed([  { name: 'Tom', age: 40, role: 'programmer' },  { name: 'Rick', age: 41, role: 'csr' },  { name: 'Stan', age: 35, role: 'account rep' },  { name: 'Bill', age: 32, role: 'salesmen' }]).select((item) => {  return { name: item.name, age: item.age };});// [//  { name: 'Tom', age: 40 },//  { name: 'Rick', age: 41 },//  { name: 'Stan', age: 35 },//  { name: 'Bill', age: 32 }// ]
```
<a name="linqed+sum"></a>

### linqed.sum(filter) ⇒ <code>number</code>
Return the numerical sum of all elements of a collection

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>number</code> - The sum of all elements, or -1 if no numerical elements can be found or no non-zero numbers are returned from the filter  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>function</code> | The filter function to determin which part of complex elements to sum |

**Example** *(.sum() with no filter)*  
```js
// Return the sum of all elements of a collection with a numerical root value
let sum = linqed([1, 'a', 1, 3, null, true, 8]).sum(); // 13
```
**Example** *(.sum() with filter function)*  
```js
// Return the sum of all values returned from the filter function
let totalExperience = linqed([
  { name: 'Tom', age: 40, role: 'programmer' },
  { name: 'Rick', age: 41, role: 'csr' },
  { name: 'Stan', age: 35, role: 'account rep' },
  { name: 'Bill', age: 32, role: 'salesmen' }
]).sum((item) => {
  return (typeof(item.age) === 'number') ? item.age - 18 : 0;
}); // 76
```
<a name="linqed+where"></a>

### linqed.where(filter) ⇒ <code>collection</code>
Return a subset of the collection. NOTE: .where() allows you to choose which elements to return, to transform those elements use .select().

**Kind**: instance method of [<code>linqed</code>](#linqed)  
**Returns**: <code>collection</code> - The collection of elements determined by the filter, or the starting collection if the filter is not a function.  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>function</code> | The filter function to use to determine which elements of the collection should be returned |

**Example**  
```js
// Return elements where the age is equal to or over 40let totalExperience = linqed([  { name: 'Tom', age: 40, role: 'programmer' },  { name: 'Rick', age: 41, role: 'csr' },  { name: 'Stan', age: 35, role: 'account rep' },  { name: 'Bill', age: 32, role: 'salesmen' }]).where((item) => {  if (item.age >= 40) {     return item;  }});// [//   { name: 'Tom', age: 40, role: 'programmer' },//   { name: 'Rick', age: 41, role: 'csr' }// ]
```

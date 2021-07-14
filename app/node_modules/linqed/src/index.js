'use strict';
/**
 * linqed is a module for performing linq like operations on Javascript arrays. This is accomplished by
 * layering linqed instance methods on top of existing Javascript arrays that have been transformed into
 * "collections"
 */


/**
 * Base constructor for linqed library
 * @param {array} array The array to convert into a linqed collection
 * @example <caption>Create a new linqed collection</caption>
 * // returns a linqed collection
 * let collection = linqed([]);
 * @returns {collection} array with linqed collection interface added on top
 */
let linqed = function(array) {

  let publicAPI = [];

  /**
   * Determine if all elements in a collection match a given filter
   * @method all
   * @memberof linqed#
   * @param {(null|number|string|boolean|function)} filter The filter to test against each element of the collection
   *
   * @example <caption>.all() with no filter</caption>
   * // Returns false with no filter specified
   * let status = linqed([1, 2, 3, 4]).all(); // false
   *
   * @example <caption>.all() with number filter</caption>
   * // Returns true if all elements match, false otherwise
   * let status = linqed([1, 1, 1, 1]).all(1); // true
   * status = linqed([1, 1, 1, 2]).all(1); // false
   *
   * @example <caption>.all() with function filter</caption>
   * // Returns true if the provided function returns true for each element, otherwise false
   * let collection = linqed([
   *   { name: 'Bob', id: 1, member: true },
   *   { name: 'Bob', id: 2, member: true },
   *   { name: 'Jeff', id: 3, member: true }
   * ]);
   *
   * let status = collection.all((item) => {
   *   return item.member;
   * }); // true
   *
   * status = collection.all((item) => {
   *   return (item.name === 'Bob') ? true : false;
   * }); //false
   *
   * @returns {boolean} true if all elements match the filter, false otherwise
   */
  let __all = function __all(filter) {

    let value = true;

    if (typeof(filter) === 'undefined'
        || filter === null) {

      value = false;
    }

    if (typeof(filter) === 'number'
        || typeof(filter) === 'string'
        || typeof(filter) === 'boolean') {

      this.forEach((item) => {
        if (item !== filter) {
          value = false;
        }
      });
    }

    if (typeof(filter) === 'function') {

      this.forEach((item) => {
        if (!filter(item)) {
          value = false;
        }
      });
    }

    return value;
  };

  /**
   * Determine the arithmetic average of all members of a collection and return it
   * @method average
   * @memberof linqed#
   * @param {(null|function)} filter The filter to determine how to calculate the average
   *
   * @example <caption>.average() with no filter</caption>
   * // Returns the average of all root elements with a numeric value in collection
   * // Notice that it ignores all elements with non-numeric root values
   * let avg = linqed([1, 3, 'a', null, 5, 7, true]).average(); // 4
   *
   * @example <caption>.average() with function for filter</caption>
   * // Returns the average of all values returned from your filter function that do not equal -1. Use this to indicate elements you do not want to include in the average.
   * let avg = linqed([
   *   { name: 'Bob', age: 20 },
   *   { name: 'Jeff', age: 40 },
   *   { name: 'Leo', age: 60 }
   * ]).average((item) => {
   *   return (typeof(item.age) === 'number') ? item.age : -1;
   * }); // 40
   *
   * @returns {number} the arithmetic average or -1 if it cannot be calculated or an invalid filter is provided
   */
  let __average = function __average(filter) {

    let count = 0;
    let total = 0;

    if (typeof(filter) === 'undefined'
        || filter === null) {
      this.forEach((item) => {

        if (typeof(item) === 'number') {
          ++count;
          total += item;
        }
      });

      return (count === 0) ? 0 : total / count;
    }

    if (typeof(filter) === 'function') {
      this.forEach((item) => {

        let res = filter(item);
        if(res !== -1) {
          ++count;
          total += res;
        }
      });

      return (count === 0) ? 0 : total / count;
    }

    return -1;
  };

  /**
   * Determine if the filter value is contained in the collection
   * @method contains
   * @memberof linqed#
   * @param {(null|number|string|boolean|function)} filter The filter to test if it exists in your collection
   *
   * @example <caption>.contains() with null/empty filter</caption>
   * // Returns false if the array is empty, true otherwise
   * let exists = linqed([
     * ]).contains(); // false
     *
   * @example <caption>.contains() with function filter</caption>
   * // Returns true if your filter returns true for any element in the collection, otherwise false
   * let exists = linqed([
   *   { name: 'Bob', age: 20 },
   *   { name: 'Jeff', age: 40 },
   *   { name: 'Leo', age: 60 }
   * ]).contains((item) => {
   *   return (item.name === 'Leo') ? true : false;
   * }); // true
   *
   * @example <caption>.contains() with base type filter</caption>
   * // Returns true if the filter strictly matches any element in the collection, otherwise false
   * let exists = linqed([1, 3, 'a', true, false, 'f', 8]).contains(9); // false
   *
   * @returns {boolean} true if any element matches the filter, false otherwise
   */
  let __contains = function __contains(filter) {

    let i = 0;

    if (typeof(filter) === 'undefined') {
          if (this.length === 0) {
            return false;
          } else {
            return true;
          }
    }

    if (typeof(filter) === 'function') {
      for(i = 0; i < this.length; ++i) {
        if (filter(this[i])) {
          return true;
        }
      }
      return false;
    } else {
      if (this.indexOf(filter) !== -1) {
        return true;
      } else {
        return false;
      }
    }
  };

  /**
   * Return a de-duplicated collection based on a filter if provided
   * @method distinct
   * @memberof linqed#
   * @param {(null|string|function)} filter The object property to diferentiate on
   *
   * @example <caption>.distinct() with no filter</caption>
   * // Return a deduplicated collection, note that comparison is strict (===)
   * let deduped = linqed([1, 1, 3, 5, 5, 'a', 'a', { a: 1, b: 2}, { a: 1, b: 2}]).distinct();
   * // [
   * // 1,
   * // 3,
   * // 5,
   * // 'a',
   * // { a: 1, b: 2 }
   * //]
   *
   * @example <caption>.distinct() with string filter</caption>
   * // Return a deduplicated collection based on a string filter
   * let deduped = linqed([{ a: 1, b: 2}, { a: 1, b: 2}, { a: 3, b: 2}, { a: 3, b: 2}]).distinct('a');
   * // [
   * // { a: 1, b: 2 },
   * // { a: 3, b: 2 }
   * //]
   *
   * @example <caption>.distinct() with function filter</caption>
   * // Return a deduplicated collection based on a function filter
   * let deduped = linqed([
   *   { a: 1, b: 1},
   *   { a: 1, b: 2},
   *   { a: 3, b: 2},
   *   { a: 3, b: 4}]).distinct((item) => {
   *   return (tyepeof(item.b) === 'number') ? item.b : null;
   * });
   * // [
   * // { a: 1, b: 1 },
   * // { a: 1, b: 2 },
   * // { a: 3, b: 4 }
   * //]
   *
   * @returns {collection} linqed collection
   */
  let __distinct = function __distinct(filter) {

    let values = linqed([]);

    if (typeof(filter) === 'undefined'
        || filter === null) {

      this.forEach((item) => {

        if (!values.contains(item)) {
          values.push(item);
        }
      });
    }

    if (typeof(filter) === 'string') {

      this.forEach((item) => {

        if (item.hasOwnProperty(filter)) {
          if (!values.contains((vi) => {
            return (vi[filter] === item[filter]) ? true : false;
          })) {
            values.push(item);
          }
        }
      });
    }

    if (typeof(filter) === 'function') {

      this.forEach((item) => {

        let iVal = filter(item);

        if (!values.contains((i) => {
          return (filter(i) === iVal) ? true : false;
        }) && iVal !== null) {
          values.push(item);
        }
      });
    }

    return values;
  }

  /**
   * Rturn an empty collection
   * @method empty
   * @memberof linqed#
   * @returns {collection} linqed collection
   */
  let __empty = function __empty() {

    this.length = 0;

    return this;
  };

  /**
   * Return a collection with all members except those that match a filter
   * @method except
   * @memberof linqed#
   * @param {(null|number|string|boolean|function|array)} filter The value or collection to remove before returning the collection
   *
   * @example <caption>.except() without filter param</caption>
   * // Return the collection with null elements removed
   * let collection = linqed([
   *   null,
   *   1,
   *   'a',
   *   null
   * ]).except(); // [1, 'a']
   *
   * @example <caption>.except() with number / string / boolean filter</caption>
   * // Return the collection with matching elements removed
   * let collection = linqed([
   *   1,
   *   2,
   *   3,
   *   4,
   *   5,
   *   'a'
   * ]).except(4); // [1, 2, 3, 5, 'a']
   *
   * @example <caption>.except() with array filter</caption>
   * // Return the collection with all elements in the filter array removed
   * let collection = linqed([
   *   1,
   *   2,
   *   3,
   *   4,
   *   5,
   *   'a'
   * ]).except([1, 2, 'a']); // [3, 4, 5]
   *
   * @example <caption>.except() with function filter</caption>
   * // Return the collection with all elements removed based on the filter function
   * let collection = linqed([
   *   1,
   *   2,
   *   3,
   *   4,
   *   5,
   *   'a'
   * ]).except((item) => {
   *   return (item !== 2 && item !== 5) ? true : false;
   * }); // [1, 3, 4, 'a']
   *
   * @returns {collection} linqed collection
   */
  let __except = function __except(filter) {

    let values = linqed([]);

    if (typeof(filter) === 'undefined'
        || filter === null) {

      this.forEach((item) => {

        if (typeof(item) !== 'undefined'
            && item !== null) {
          values.push(item);
        }
      });
    }

    if (typeof(filter) === 'number') {

      this.forEach((item) => {
        if (typeof(item) === 'number'
            && item !== filter) {
          values.push(item);
        }
      });
    }

    if (typeof(filter) === 'string') {

      this.forEach((item) => {
        if (typeof(item) === 'string'
            && item !== filter) {
          values.push(item);
        }
      });
    }

    if (typeof(filter) === 'boolean') {

      this.forEach((item) => {
        if (typeof(item) === 'boolean'
            && item !== filter) {
          values.push(item);
        }
      });
    }

    if (typeof(filter) === 'function') {

      this.forEach((item) => {

        if(filter(item)) {
          values.push(item);
        }
      });
    }

    if (Array.isArray(filter)) {

      this.forEach((item) => {
        if(!filter.contains(item)) {
          values.push(item);
        }
      });
    }

    return values;
  }

  /**
   * Return the first element of the collection that matches the provided filter or null if no match is found
   * @method first
   * @memberof linqed#
   * @param {(null|number|string|boolean|function)} filter The filter to determine which element is returned
   *
   * @example <caption>.first() with no filter</caption>
   * // Return the first non-null element of the collection
   * let value = linqed([null, null, 1, 3, 5]).first(); // 1
   *
   * @example <caption>.first() with base type filter (number, string, boolean)</caption>
   * // Return the first element that strictly matches the filter provided
   * let value = linqed([null, 1, 'a', true, false, 6, 6, 7]).first(6); // 6
   *
   * @example <caption>.first() with function filter</caption>
   * // Return the first element where your provided filter function returns true
   * let value = linqed([
   *   { name: 'Bob', age: 20 },
   *   { name: 'Jeff', age: 40 },
   *   { name: 'Leo', age: 60 }
   * ]).first((item) => {
   *   return (item.age > 30) ? true : false;
   * }); // { name: 'Jeff', age: 40 }
   *
   * @returns {any} The element of the collection that is the first match to your provided filter or null if no match is found
   */
  let __first = function __first(filter) {

    let i = 0;

    if (typeof(filter) === 'undefined'
        || filter === null) {
      for(i = 0; i < this.length; ++i) {
        if (!!this[i]) {
          return this[i];
        }
      }
    }

    if (typeof(filter) === 'number'
               || typeof(filter) === 'string'
               || typeof(filter) === 'boolean') {
      for(i = 0; i < this.length; ++i) {
        if (this[i] === filter) {
          return i;
        }
      }
      return -1;
    }

    if (typeof(filter) === 'function') {
      for(i = 0; i < this.length; ++i) {
        if (filter(this[i])) {
          return this[i];
        }
      }
      return null;
    }

    console.error(`.first() does not support filters of type "${typeof(filter)}"`)
    return null;
  };

  /**
   * Return the first element of the collection that matches the provided filter or a default value if no match is found
   * @method firstOrDefault
   * @memberof linqed#
   * @param {(null|number|string|boolean|function)} filter The filter to determine which element is returned
   * @param {any} default The default value to return if no match is found based on the filter provided
   *
   * @example <caption>.firstOrDefault() with no filter</caption>
   * // Return the default when no valid filter is provided
   * let value = linqed([null, null, 1, 3, 5]).firstOrDefault(null, 8); // 8
   *
   * @example <caption>.firstOrDefault() with base type filter (number, string, boolean)</caption>
   * // Return the first element that strictly matches the filter provided or default if no match
   * let value = linqed([null, 1, 'a', true, false, 6, 6, 7]).first(6, 10); // 6
   *
   * @example <caption>.firstOrDefault() with function filter</caption>
   * // Return the first element where your provided filter function returns true or the default
   * let value = linqed([
   *   { name: 'Bob', age: 20 },
   *   { name: 'Jeff', age: 40 },
   *   { name: 'Leo', age: 60 }
   * ]).first((item) => {
   *   return (item.age > 65) ? true : false;
   * }, 8); // 8
   *
   * @returns {any} The element of the collection that is the first match to your provided filter or your default if no match is found
   */
  let __firstOrDefault = function __firstOrDefault(filter, def) {

    let value = null;

    if (typeof(filter) === 'undefined'
        || filter === null) {
      return def;
    }

    if (typeof(filter) === 'number'
        || typeof(filter) === 'string'
        || typeof(filter) === 'boolean') {
      value = this.first(filter);
      if (value === null
          || value === -1) {
        return def;
      } else {
        return value;
      }
    }

    if (typeof(filter) === 'function') {
      value = this.first(filter);
      if (value === null) {
        return def;
      } else {
        return value;
      }
    }

    console.error(`.first() does not support filters of type "${typeof(filter)}"`)
    return null;
  };

  /**
   * Returns the subset of the collection that is also part of your filter collection
   * @method intersect
   * @memberof linqed#
   * @param {collection|array|number|string|boolean|object} filterCollection The collection or value to filter with
   *
   * @example <caption>.intersect() with no filter</caption>
   * // Return an empty collection
   * let collection = linqed([1, 2, 3, 4, 5]).intersect(); // []
   *
   * @example <caption>.intersect() with a collection as filter</caption>
   * // Return a collection of elements that are common to the base collection and the filter collection
   * let collection = linqed([1, 2, 3, 4, 5, 6]).intersect(linqed([3, 4, 5, 7, 8])); // [3, 4, 5]
   *
   * @example <caption>.intersect() with a single value</caption>
   * // Filters that are not arrays or collections are treated as single element collections
   * let collection = linqed([1, 2, 3, 4, 5, 6]).intersect(6); // [6]
   *
   * @example <caption>.intersect() with a filter that has no common elements</caption>
   * // Where no common elements are found an empty collection is returned
   * let collection = linqed([1, 2, 3, 4, 5, 6]).intersect(10); // []
   *
   * @returns {collection} The collection of values common to the base collection and the filter provided
   */
  let __intersect = function __intersect(filterCollection) {

    let values = this;

if (typeof(filterCollection) === 'undefined' || filterCollection === null) {
    return linqed([]);
}

    if (Array.isArray(filterCollection)) {

      filterCollection.forEach((item) => {

        if (!values.contains(item)) {

          values.push(item);
        }
      });
    } else if (typeof(filterCollection) === 'number'
        || typeof(filterCollection) === 'string'
        || typeof(filterCollection) === 'boolean'
        || typeof(filterCollection) === 'object') {

      if (!values.contains(filterCollection)) {

        values.push(filterCollection);
      }
    }

   // console.log(values);
    return values;
  }

  /**
   * Returns a merged collection based on matching the specified filter property. Assumes property named id if no filter is specified.
   * @method join
   * @memberof linqed#
   * @param {collection|array} outer Collection to use as the outer member of an standard inner join
   * @param {string|function} filter Either a property name to match on, or a function that does the matching for us and returns the value of an object to match on.
   *
   * @example <caption>.join() with no default id matching</caption>
   * // With a valid outer collection but no filter .join() assumes
   * // that the objects of both arrays have an 'id' property
   * let joined = linqed([
   *   { name: 'Jeff', id: 1 },
   *   { name: 'Rick', id: 2 },
   *   { name: 'John', id: 3 }
   * ]).join(linqed([
   *   { city: 'Atlanta', id: 1 },
   *   { city: 'Salem', id: 2 },
   *   { city: 'New York', id: 3 }
   * ]));
   * console.log(joined);
   * //[
   * //  { name: 'Jeff', id: 1, city: 'Atlanta' },
   * //  { name: 'Rick', id: 2, city: 'Salem' },
   * //  { name: 'John', id: 3, city: 'New York' }
   * //]
   *
   * @example <caption>.join() with string filter</caption>
   * // With a valid outer collection and a string filter .join()
   * // will merge the collections based on matching properties
   * // with your string filter for a name
   * let joined = linqed([
   *   { name: 'Jeff', id: 1 },
   *   { name: 'Rick', id: 2 },
   *   { name: 'John', id: 3 }
   * ]).join(linqed([
   *   { city: 'Atlanta', id: 1 },
   *   { city: 'Salem', id: 2 },
   *   { city: 'New York', id: 3 }
   * ]), 'id');
   * console.log(joined);
   * //[
   * //  { name: 'Jeff', id: 1, city: 'Atlanta' },
   * //  { name: 'Rick', id: 2, city: 'Salem' },
   * //  { name: 'John', id: 3, city: 'New York' }
   * //]
   *
   * @example <caption>.join() with a function filter</caption>
   * // With a valid outer collection and a function to return the
   * // value to match collection objects on
   * let joined = linqed([
   *   { name: 'Jeff', id: 1 },
   *   { name: 'Rick', id: 2 },
   *   { name: 'John', id: 3 }
   * ]).join(linqed([
   *   { city: 'Atlanta', id: 1 },
   *   { city: 'Salem', id: 2 },
   *   { city: 'New York', id: 3 }
   * ]), (item) => {
   *   return (typeof(item.id) === number) ? item.id : null;
   * });
   * console.log(joined);
   * //[
   * //  { name: 'Jeff', id: 1, city: 'Atlanta' },
   * //  { name: 'Rick', id: 2, city: 'Salem' },
   * //  { name: 'John', id: 3, city: 'New York' }
   * //]
   *
   * @returns {collection} The merged collection that results from joining the inner (base) collection and the provided outer function.
   */
  let __join = function __join(outer, filter) {

    let joinedArray = linqed([]);

    if (Array.isArray(outer) && typeof(filter) === 'undefined') {

      this.forEach((item) => {

        joinedArray.push(Object.assign({}, item, outer.firstOrDefault((oi) => {
          return (oi['id'] === item['id']) ? true : false;
        }, {})));
      });

      return joinedArray;
    }

    if (Array.isArray(outer) && typeof(filter) === 'string') {

      this.forEach((item) => {

        joinedArray.push(Object.assign({}, item, outer.firstOrDefault((oi) => {
          return (oi[filter] === item[filter]) ? true : false;
        }, {})));
      });

      return joinedArray;
    }

    if (Array.isArray(outer) && typeof(filter) === 'function') {

      this.forEach((item) => {

        let res = filter(item);

        joinedArray.push(Object.assign({}, res, outer.firstOrDefault((oi) => {
          return (filter(oi) === res) ? true : false;
        }, {})));
      });

      return joinedArray;
    }

    return this;
  };

  /**
   * Return the largest numerical value of the collection
   * @method max
   * @memberof linqed#
   * @param {(null|function)} filter The filter function to determine how to compare elements if needed
   *
   * @example <caption>.max() with no filter provided</caption>
   * // Returns the value of the largest element with a root numerical value
   * let biggest = linqed(['a', null, true, 5, 'thirteen', 2]).max(); // 5
   *
   * @example <caption>.max() with filter function</caption>
   * // Return the largest element baesd on numberical values provided by your filter function
   * let biggest = linqed([
   *   { name: 'Tom', age: 40 },
   *   { name: 'Rick', age: 41 },
   *   { name: 'Stan', age: 35 },
   *   { name: 'Bill', age: 32 }
   * ]).max((item) => {
   *   return (typeof(item.age) === 'number') ? item.age : -1;
   * }); // 41
   *
   * @returns {number} The largest numerical value from a collection, or -1 if none can be identified.
   */
  let __max = function __max(filter) {

    let value = -1;

    if (typeof(filter) === 'undefined'
        || filter === null) {

      this.forEach((item) => {

        if (typeof(item) === 'number'
            && item > value) {
          value = item;
        }
      });
    }

    if (typeof(filter) === 'function') {

      this.forEach((item) => {
        let res = filter(item);

        if (res > value) {
          value = res;
        }
      });
    }

    return value;
  };

  /**
   * Return the smallest numerical value of the collection
   * @method min
   * @memberof linqed#
   * @param {(null|function)} filter The filter function to determine how to compare elements if needed
   *
   * @example <caption>.min() with no filter provided</caption>
   * // Returns the value of the smallest element with a root numerical value
   * let smallest = linqed(['a', null, true, 5, 'thirteen', 2]).min(); // 2
   *
   * @example <caption>.min() with filter function</caption>
   * // Return the smallest element baesd on numberical values provided by your filter function
   * let smallest = linqed([
   *   { name: 'Tom', age: 40 },
   *   { name: 'Rick', age: 41 },
   *   { name: 'Stan', age: 35 },
   *   { name: 'Bill', age: 32 }
   * ]).min((item) => {
   *   return (typeof(item.age) === 'number') ? item.age : Infinity;
   * }); // 32
   *
   * @returns {number} The smallest numerical value from a collection, or Infinity if none can be identified.
   */
  let __min = function __min(filter) {

    let value = Infinity;

    if (typeof(filter) === 'undefined'
        || filter === null) {

      this.forEach((item) => {

        if (typeof(item) === 'number'
            && item < value) {
          value = item;
        }
      });
    }

    if (typeof(filter) === 'function') {

      this.forEach((item) => {
        let res = filter(item);

        if (res < value) {
          value = res;
        }
      });
    }

    return value;
  }

  /**
   * Return a collection with elements determined by the filter function provided. NOTE: .select() allows you to control what parts of each object in a collection are returned, but all elements are returned. To limit which elements are returned use .where().
   * @method select
   * @memberof linqed#
   * @param {function} filter The function that determins what part of each element is returned in the new collection
   *
   * @example
   * // Return the name and age attributes of each element
   * let collection = linqed([
   *   { name: 'Tom', age: 40, role: 'programmer' },
   *   { name: 'Rick', age: 41, role: 'csr' },
   *   { name: 'Stan', age: 35, role: 'account rep' },
   *   { name: 'Bill', age: 32, role: 'salesmen' }
   * ]).select((item) => {
   *   return { name: item.name, age: item.age };
   * });
   * // [
   * //  { name: 'Tom', age: 40 },
   * //  { name: 'Rick', age: 41 },
   * //  { name: 'Stan', age: 35 },
   * //  { name: 'Bill', age: 32 }
   * // ]
   *
   * @returns {collection} The collection of selected properties for each element
   */
  let __select = function __select(filter) {

    let collection = linqed([]);

    if (typeof(filter) === 'function') {
      this.forEach((item) => {
        collection.push(filter(item));
      });
      return collection;
    }

    return this;
  };

  /**
   * Return the numerical sum of all elements of a collection
   * @method sum
   * @memberof linqed#
   * @param {function} filter The filter function to determin which part of complex elements to sum
   *
   * @example <caption>.sum() with no filter</caption>
   * // Return the sum of all elements of a collection with a numerical root value
   * let sum = linqed([1, 'a', 1, 3, null, true, 8]).sum(); // 13
   *
   * @example <caption>.sum() with filter function</caption>
   * // Return the sum of all values returned from the filter function
   * let totalExperience = linqed([
   *   { name: 'Tom', age: 40, role: 'programmer' },
   *   { name: 'Rick', age: 41, role: 'csr' },
   *   { name: 'Stan', age: 35, role: 'account rep' },
   *   { name: 'Bill', age: 32, role: 'salesmen' }
   * ]).sum((item) => {
   *   return (typeof(item.age) === 'number') ? item.age - 18 : 0;
   * }); // 76
   *
   * @returns {number} The sum of all elements, or -1 if no numerical elements can be found or no non-zero numbers are returned from the filter
   */
  let __sum = function __sum(filter) {

    let total = 0;

    if (typeof(filter) === 'undefined'
        || filter === null) {

      this.forEach((item) => {
        if (typeof(item) === 'number') {
          total += item;
        }
      });
    }

    if (typeof(filter) === 'function') {

      this.forEach((item) => {
        let res = filter(item);
        if (typeof(res) === 'number') {
          total += res;
        }
      });
    }

    return (total === 0) ? -1 : total;
  };

  /**
   * Return a subset of the collection. NOTE: .where() allows you to choose which elements to return, to transform those elements use .select().
   * @method where
   * @memberof linqed#
   * @param {function} filter The filter function to use to determine which elements of the collection should be returned
   *
   * @example
   * // Return elements where the age is equal to or over 40
   * let totalExperience = linqed([
   *   { name: 'Tom', age: 40, role: 'programmer' },
   *   { name: 'Rick', age: 41, role: 'csr' },
   *   { name: 'Stan', age: 35, role: 'account rep' },
   *   { name: 'Bill', age: 32, role: 'salesmen' }
   * ]).where((item) => {
   *   if (item.age >= 40) {
   *      return item;
   *   }
   * });
   * // [
   * //   { name: 'Tom', age: 40, role: 'programmer' },
   * //   { name: 'Rick', age: 41, role: 'csr' }
   * // ]
   *
   * @returns {collection} The collection of elements determined by the filter, or the starting collection if the filter is not a function.
   */
  let __where = function __where(filter) {

    if (typeof(filter) !== 'function') {
      return this;
    }

    return this.filter(filter);
  };

  publicAPI.push(
    { name: 'all', method: __all },
    { name: 'average', method: __average },
    { name: 'contains', method: __contains },
    { name: 'distinct', method: __distinct },
    { name: 'empty', method: __empty },
    { name: 'except', method: __except },
    { name: 'first', method: __first },
    { name: 'firstOrDefault', method: __firstOrDefault },
    { name: 'intersect', method: __intersect },
    { name: 'join', method: __join },
    { name: 'max', method: __max },
    { name: 'min', method: __min },
    { name: 'select', method: __select },
    { name: 'sum', method: __sum },
    { name: 'where', method: __where }
  );

  publicAPI.forEach((endpoint) => {
    Object.defineProperty(array, endpoint.name, {
      enumerable: false,
      value: endpoint.method
    });
  });

  return array;
};

module.exports = linqed;

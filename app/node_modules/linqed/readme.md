# linqed

linqed (pronounced linked), is a no frills linq library for Javascript. It boasts the following.

* No prototype pollution
* Simple transformation of any array into a linqed collection without impacting the rest of your arrays
* All add-on methods are non-enumerable to help keep them from getting in your way
* Easy to use chainable fluent syntax
* Does not re-create functionality that already exists on native Javascript Arrays

Check out the [API](https://github.com/WebMatrixware/linqed/blob/master/api.md) for details on methods and usage.

# Philosophy

linqed's goal is to be lightweight, simple, and easy to use. Rather than provide an entire data layer linqued looks to add basic query and data manipulation functionality to arrays.

Linqued therefore does not attempt to meet every use case, but instead to focus on those core pieces that will be used regularly by a wide variety of projects.

With that in mind please note that some things are left out intentionally because they either do not make sense or arrays already provide them. The classic example is a `count()` method, while nearly every other linq implementation for nearly every language has one, arrays already have a length property that a `count()` method would most likely just wrap and pass back.

With that being said, I am always happy to be convinced of a new use case or some better way of handling a common problem that can or should be added.

# Installation

```
npm install -s linqed
```

# Basic Usage

```javascript
const Linqed = require('linqed');

// This attaches the linqed interface to your new empty array
let collection = Linqed([]);
```

# Syntax

Linqed has two types of methods, those that work on a linqed collection and return that collection altered in some way (chainable methods) and those that work on a linqed collection and return some other value as a result (final methods).

For example, the `.distinct()` (a chainable method) method returns a linqed collection with all duplicate members removed from it, while the `.min()` (a final method) function returns the smallest value of the collection.

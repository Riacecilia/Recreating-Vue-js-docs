---
title: State Management
description: A guide to state management in Vue.js
---

State management refers to the strategies and patterns used to organize, store, update, and share data (or "state") throughout your application in an efficient and predictable way.


A simpler way to understand State Management is to think of a website like a restaurant. 

- When you walk into a restaurant, lots of things happen. You tell the waiter how many people are in your group, look at a menu, order food, wait for it to be cooked, and then eat it.


- State management in a website is like the restaurant's manager, waiters, and kitchen staff all working together perfectly to keep track of everything that's going on at all times.


- Just like a good restaurant manager makes sure every order is tracked, every table is served, and everyone knows what's happening, state management makes sure your website remembers your authentification, shows you a loading spinner when it fetches new information, keeps track of all items you may have added to your shopping card, and everything else it needs to, in order to give you a smooth experience. 


State management is how the website keeps all its information organized and up-to-date, making sure every part of it knows what's going on.


## Why is State Management necessary?


- **Dealing with 'Shared State'**: This occurs When multiple components need to access and/or modify the same piece of data. Without a centralized state management solution, you might resort to: 

  - Prop Drilling: Passing data down through many layers of components (parent to child to grandchild, etc.) which can be tedious and make your code harder to maintain.

	- Event Emitters: Emitting events up the component tree and then passing data back down, which can also become complex for deeply nested components or sibling communication.

- **Predictability**: Ensuring that data changes are consistent and traceable. Without a clear pattern, it can be difficult to debug where a piece of data was changed and by what action.

- **Centralized Source of Truth**: Having a single, authoritative place for your application's global data, making it easier to reason about the overall state of your application.

- **Debugging and Tooling**: Dedicated state management solutions often come with developer tools that allow for inspection of state changes over time (time-travel debugging), making it much easier to identify and fix issues.

 
## Simple State Management using Reactivity API


1. Declare reactive data using `data()` option. The object returned by `data()` is made reactive via the `reactive()` function.


```js 
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```


2. Create a reactive object using `reactive()` and export it into multiple components. In this example, it is ComponentA and ComponentB.


``` js  
<!-- ComponentA.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From A: {{ store.count }}</template>
```


``` js 
<!-- ComponentB.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From B: {{ store.count }}</template>
```


3. Now whenever the store object is mutated, both <ComponentA> and <ComponentB> will update their views automatically - we have a single source of truth now.


### Caveats ###


- Whenever the store object is mutated, both <ComponentA> and <ComponentB> will update their views automatically - we have a single source of truth now.

- This also means any component importing store can mutate it however they want:
``` html
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>

``` 

- While this example solution works in simple cases, global state that can be arbitrarily mutated by any component is not maintainable in the long run. To centralise the state-mutating logic, define methods on the store with names that express the intention of the actions:


```js 
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```


``` html 
<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```


:::tip
Note the click handler uses `store.increment()` with parentheses - this is necessary to call the method with the proper `this` context since it's not a component method.

:::


## Other methods of implementing Simple State Management using Reactivity API ##
Although in this example we use a single reactive object as a store, you can also share reactive state created using other Reactivity APIs such as: 
- using `ref()` 
- using `computed()` 
- returning global state from a Composable, like with the following code:


```js 
import { ref } from 'vue'

// global state, created in module scope
const globalCount = ref(1)

export function useCount() {
  // local state, created per-component
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```


As there are multiple ways that you can implement state management, Vue is flexible. You're not locked into one specific structure (like a single reactive object). You can mix and match `ref()`, `reactive()`, and `computed()`, and package them neatly within Composables, to create shared, reactive state that perfectly fits the needs and scale of your application.

## SSR Considerations for State Management 


If you are building an application that leverages Server Side Rendering, the above pattern can lead to issues due to the store being a singleton shared across multiple requests


Read a detailed guide on [Server-Side Rendering (SSR)](https://vuejs.org/guide/scaling-up/ssr.html)


## Product Recommendation : Pinia


The previous examples of simple state management techniques will work in simple scenarios. However, these solutions are unsuitable for large scale applications.

This is because large scale applications have additional needs such as:

- Stronger conventions for team collaboration
- Integrating with the Vue DevTools, including timeline, in-component inspection, and time-travel debugging
- Hot Module Replacement
- Server-Side Rendering support

Pinia is a state management library that implements all of the above. It is maintained by the Vue core team, and works with both Vue 2 and Vue 3.

Existing users may be familiar with Vuex, the previous official state management library for Vue. With Pinia serving the same role in the ecosystem, Vuex is now in maintenance mode. It still works, but will no longer receive new features. 


**It is recommended to use Pinia for new applications**.


### Pinia vs Vuex Comparison

| Feature | Pinia | Vuex |
|---------|--------|------|
| **TypeScript Support** | Built-in, excellent type inference | Requires additional setup, limited inference |
| **API Style** | Composition API-based, intuitive | Options API, more verbose |
| **Bundle Size** | Smaller (~1.5KB) | Larger (~2.5KB) |
| **Learning Curve** | Easier, more straightforward | Steeper, more concepts to learn |
| **Store Structure** | Multiple stores, modular by default | Single store with modules |
| **Mutations** | Not required, direct state modification | Required for all state changes |
| **Actions** | Can be sync or async, simplified | Separate from mutations, more complex |
| **Getters** | Simple computed properties | More verbose getter syntax |
| **Devtools Support** | Excellent Vue DevTools integration | Good Vue DevTools support |
| **Hot Module Replacement** | Better HMR experience | Limited HMR support |
| **Vue 3 Integration** | Designed for Vue 3, official recommendation | Works but not the preferred choice |
| **Vue 2 Support** | Via plugin | Native support |
| **Server-Side Rendering** | Built-in SSR support | Requires additional configuration |
| **Code Splitting** | Automatic with multiple stores | Manual module splitting |
| **State Persistence** | Easier with plugins | More complex setup |
| **Testing** | More straightforward to test | Requires more boilerplate |
| **Migration Path** | Can gradually migrate from Vuex | N/A |
| **Community & Ecosystem** | Growing rapidly, newer | Mature, established ecosystem |
| **Official Status** | Official state management for Vue 3 | Legacy, maintenance mode |


**Choose Pinia if:**
- Building new Vue 3 applications
- Want better TypeScript support
- Prefer simpler, more intuitive API
- Need better development experience

**Choose Vuex if:**
- Working with existing Vue 2 applications
- Already have a large Vuex codebase
- Need maximum ecosystem compatibility
- Team is already familiar with Vuex patterns
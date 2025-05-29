---
title: Composables
description: A guide to using composables in Vue.
---
## What is a composable? ##

A "composable" is a function that leverages Vue's Composition API to encapsulate and reuse stateful logic.

Stateful logic is code or a system that remembers information about its past interactions, inputs, or conditions. This "remembered information" is called its state. The behavior or output of stateful logic at any given moment depends not only on its current inputs but also on its accumulated state from previous operations.

Composables are becomes beneficial (and recommended) when you have a piece of stateful logic that needs to be shared and reused across multiple components in your Vue.js application. 

For example: when managing authentification status and user information in an application. The code often needs to verify authentification at log in, when viewing other users profiles or when trying to access restricted content.


## Mouse tracker example ##

**Aim** 

To track and display the real-time position of the user's cursor on the screen.

**Implementation**

This code is the mouse tracking functionality using the Composition API directly inside a component:

```markdown
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>

```


Using the same code, what if we want to reuse the same logic in multiple components? We can extract the logic into an external file, as a composable function:

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// by convention, composable function names start with "use"
export function useMouse() {
  // state encapsulated and managed by the composable
  const x = ref(0)
  const y = ref(0)

  // a composable can update its managed state over time.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expose managed state as return value
  return { x, y }
}

```


The same code can be used in components:

```markdown
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

**Code analysis**

- The core logic in all 3 code snippets remains identical - all we had to do was move it into an external function and return the state that should be exposed. 

- Composables can use the full range of Composition API functions. The same `useMouse()` functionality can now be used in any component.

- You can nest composables : one composable function can call one or more other composable functions. This enables us to compose complex logic using small, isolated units, similar to how we compose an entire application using components. 

- In fact, this is why we decided to call the collection of APIs that make this pattern possible Composition API.


For example, we can extract the logic of adding and removing a DOM event listener into its own composable:

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // if you want, you can also make this
  // support selector strings as target
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```


And now our useMouse() composable can be simplified to:

```js
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```


:::tip
Each component instance calling `useMouse()` will create its own copies of `x` and `y` state so they won't interfere with one another. If you want to manage shared state between components, read the State Management chapter.

:::

****


## Async state example ##

**Aim**
This Vue.js code defines a component that fetches data from a remote API endpoint and displays its content, along with handling loading and error states.

**Implementation**

```markdown
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

```
**Code analysis:**

- It attempts to load data from a specified URL upon creation. 
- While the data is being fetched, it displays a "Loading..." message. 
- If the data is successfully loaded, it renders the data. 
- If an error occurs during the fetching process, it displays an error message.


It would be tedious to have to repeat this pattern in every component that needs to fetch data. Let's extract it into a composable:

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```


Now in our component we can just do:

```markdown
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>

```

**Code analysis:** 

- The useFetch composable provides a reusable and encapsulated way to perform data fetching. 
- When you import and call `useFetch('your-api-url')` in a Vue component:

    - It immediately initiates an API call to the specified URL.
    - It exposes reactive data and error variables.
    - Your component can then use these data and error refs in its template to display the fetched information, an error message, or a loading state (though a loading ref is often added to more complete useFetch composables).

- This design promotes code reusability, modularity, and clean separation of concerns by moving data-fetching logic out of individual components and into a dedicated, reusable function.


### Async state example with reactive state ##

In the previous example, `useFetch()` takes a static URL string as input - so it performs the fetch only once and is then done. What if we want it to re-fetch whenever the URL changes? 

To do this, we need to pass reactive state into the composable function, and let the composable create watchers that perform actions using the passed state.


### Composable with a ref ### 
For example, `useFetch()` should be able to accept a ref:

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// this should trigger a re-fetch
url.value = '/new-url'
```

### Composable with functions ###

`useFetch()` should be able to accept a [getter function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description):


```js
// re-fetch when props.id changes
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

### Composables with APIs ###
We can refactor our existing implementation with the `watchEffect()` and `toValue()` APIs:

```js
// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // reset state before fetching..
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

**Code Analysis**

- `toValue()` is an API added in 3.3. It is designed to normalize refs or getters into values. 
    - If the argument is a ref, it returns the ref's value
    - if the argument is a function, it will call the function and return its return value. 
    - Otherwise, it returns the argument as-is. It works similarly to `unref()`, but with special treatment for functions.

- Notice that `toValue(url)` is called inside the `watchEffect` callback. This ensures that any reactive dependencies accessed during the `toValue()` normalization are tracked by the watcher.

- This version of `useFetch()` now accepts static URL strings, refs, and getters, making it much more flexible. 
    - The watch effect will run immediately, and will track any dependencies accessed during `toValue(url)`. 
    - If no dependencies are tracked (e.g. url is already a string), the effect runs only once; 
    - otherwise, it will re-run whenever a tracked dependency changes.



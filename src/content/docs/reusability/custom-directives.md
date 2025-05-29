---
title: Custom Directives
description: A guide to writing custom directives in Vue.
---

## Introduction ##

In addition to the built-in directives (like v-model or v-show), Vue also allows you to register your own custom directives.

A custom directive is a way to reuse logic that involves low-level DOM manipulation on plain elements. While Vue's built-in directives handle common DOM interactions, custom directives allow you to create your own specialized DOM behaviors.


***


## When to use custom directives ##


Custom directives should be used when you need to directly manipulate the DOM element the directive is bound to, and that manipulation doesn't warrant creating a full component. 


Examples scenarios include:
- Adding focus to an input field (v-focus).
- Implementing a simple tooltip or popover.
- Resizing an element.
- Integrating a third-party library that directly interacts with the DOM.
- Applying specific CSS classes or styles based on certain conditions.


***


## Features of Custom Directives ##
- Defined as an object with lifecycle hooks (e.g., `mounted`, `updated`, `beforeUnmount`).
- Receives the actual DOM element (`el`) as an argument in its hooks.
- Primarily focuses on DOM manipulation rather than managing complex state or UI structures.
- Usually applies to existing HTML elements.
- Custom directives must be registered so they can be used in templates. You can do this via the `directives` option.
- It is also common to globally register custom directives at the app level.

Example

**Aim:**
This code defines a custom directive called `highlight` and uses it to highlight a sentence.


**Implementation**


```js 
const highlight = {
  mounted: (el) => el.classList.add('is-highlight')
}

export default {
  directives: {
    // enables v-highlight in template
    highlight
  }
}

```


```markdown
<p v-highlight>This sentence is important!</p>
```


**Code analysis**

The first snippet: 
- Defines a custom directive named highlight.
- When an element with `v-highlight` is mounted to the DOM, this directive will automatically add the CSS class `is-highlight` to that element.

The second snippet:
- Applies the highlight custom directive to the `<p>` (paragraph) HTML element.
- When this `<p>` element is rendered and inserted into the DOM (the mounted lifecycle hook of the directive is triggered), the JavaScript logic within the highlight directive's mounted hook will execute.
- Specifically, `el.classList.add('is-highlight')` will be called, where `el` refers to this specific `<p>` element.
- This will add the CSS class is-highlight to the `<p>` element.


***


## Directive Hooks ##

Directive Hooks are specific, named functions (like mounted, updated, unmounted, beforeUpdate, created, etc.) that Vue calls automatically at different stages of the lifecycle of the element the directive is bound to. 


These hooks are where you write the actual JavaScript code that implements the directive's behavior.


Without directive hooks, a custom directive would do nothing. The hooks are the entry points where you get access to the DOM element (el) and other binding information to perform your desired operations.


A directive definition object can provide several hook functions (all optional):

```js 
const myDirective = {
  // called before bound element's attributes
  // or event listeners are applied
  created(el, binding, vnode) {
    // see below for details on arguments
  },
  // called right before the element is inserted into the DOM.
  beforeMount(el, binding, vnode) {},
  // called when the bound element's parent component
  // and all its children are mounted.
  mounted(el, binding, vnode) {},
  // called before the parent component is updated
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // called after the parent component and
  // all of its children have updated
  updated(el, binding, vnode, prevVnode) {},
  // called before the parent component is unmounted
  beforeUnmount(el, binding, vnode) {},
  // called when the parent component is unmounted
  unmounted(el, binding, vnode) {}
}
```

Hook arguments

- `el`: the element the directive is bound to. This can be used to directly manipulate the DOM.

- `binding`: an object containing the following properties:

    - value: The value passed to the directive. For example in `v-my-directive="1 + 1"`, the value would be `2`.

    - `oldValue`: The previous value, only available in beforeUpdate and updated. It is available whether or not the value has changed.

    - `arg`: The argument passed to the directive, if any.  For example in `v-my-directive:foo`, the `arg` would be "foo".

    - `modifiers`: An object containing modifiers, if any. For example in `v-my-directive.foo.bar`, the modifiers object would be `{ foo: true, bar: true }`.

    - `instance`: The instance of the component where the directive is used.

    - `dir`: the directive definition object.

- `vnode`: the underlying VNode representing the bound element.

- `prevVnode`: the VNode representing the bound element from the previous render. Only available in the beforeUpdate and updated hooks.                                                                          |


**Example of directive hooks in custom directives:**


```markdown
<div v-example:foo.bar="baz">
```

Aim:

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* value of `baz` */,
  oldValue: /* value of `baz` from previous update */
}
```

Similar to built-in directives, custom directive arguments can be dynamic. For example

```markdown
<div v-example:[arg]="value"></div>
```


Here the directive argument will be reactively updated based on arg property in our component state.


:::note
Apart from el, you should treat these arguments as read-only and never modify them. If you need to share information across hooks, it is recommended to do so through element's dataset.

:::


***


## Function Shorthand ##

It's common for a custom directive to have the same behavior for `mounted` and `updated`, with no need for the other hooks. In such cases we can define the directive as a function:

```markdown
<div v-color="color"></div>
```


```js
app.directive('color', (el, binding) => {
  // this will be called for both `mounted` and `updated`
  el.style.color = binding.value
})
```

***


## Object Literals ##


If your directive needs multiple values, you can also pass in a JavaScript object literal. Remember, directives can take any valid JavaScript expression.


```markdown
<div v-demo="{ color: 'white', text: 'hello!' }"></div>

```


```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})

```

***


## Usage on Components ##

:::caution
Using custom directives on components is not recommended. Unexpected behaviour may occur when a component has multiple root nodes.
:::


When used on components, custom directives will always apply to a component's root node, similar to Fallthrough Attributes.


```markdown
<MyComponent v-demo="test" />

```

```markdown
<!-- template of MyComponent -->

<div> <!-- v-demo directive will be applied here -->
  <span>My component content</span>
</div>

```


Note that components can potentially have more than one root node. When applied to a multi-root component, a directive will be ignored and a warning will be thrown. Unlike attributes, directives can't be passed to a different element with v-bind="$attrs".


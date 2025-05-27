---
title: Class and Style bindings
description: How to do class and style bindings in Vue.
---


In HTML, a class is a reusable label or category applied to elements, allowing you to group them for consistent styling and behavior (e.g., all "button" elements look the same).

In contrast, an inline style is a direct, one-off instruction applied to a single element for specific visual properties (e.g., making this one paragraph red)

On this page you will learn how to: 
- toggle, add, or remove CSS classes on an element conditionally


## Binding HTML Classes ##

Binding an HTML class allows you to make an automatic connection between a piece of information and whether a certain visual "label" is attached to an HTML element.

For example: If your information says "it's active," the element automatically gets the "active" class. If your information says "it's not active," the element automatically loses the "active" class. 

This makes your web page look and behave differently without you having to write lots of complicated instructions every time something changes. 

There are a few ways to do this. You can
- Bind to objects : Apply/remove different styles based on whether information meets certain conditions.  
- Bind to arrays: You want the UI to combine some fixed styles with conditional ones.
- Bind with components: You need a two-way data binding between a parent component's data property and a custom child component's internal value. For example: Imagine you have a remote control for a toy car.

    - If you use binding with components, when you move the joystick on the remote, the car's speed changes. But also, if the car hits something and slows down, the joystick on your remote itself moves back to reflect the car's new speed. Both ends are connected and update each other.

### Binding to Objects ###
**Example 1: How to change the appearance of something reactively**  

In a real life scenario, we would need this if we wanted to control how some content on a webpage appears. 

Aim: You want to control the appearance of some content  on your webpage 

Implementation: Use the following code:

```html
<div :class="{ active: isActive }"></div>
```

Code analysis:
- `:class` is shorthand for the Vue directive `v-bind`. This is what makes the class attribute dynamic and tells Vue to bind its value to data.

- if `isActive` is true, the content in `div` will have all the defined styles for the `.active` CSS class applied.

- If `isActive` is false, the styles will be removed

*** 


**Example 2: Adding conditional styling based on different states of components data** 

In a real life scenario, we would need this if we wanted to build a dynamic user interface where elements visually respond to changes in your application's state.


Implementation:
Given the following state: 

```js 
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

And the following template:
``` html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

it will render:

``` html
<div class="static active"></div>
```

Code analysis:
- `class-"static"` applies the base styling to the content. Let's imagine the base styling is a light grey background with rounded corners.  

- `isActive` is a data property in your Vue component that is expected to be a boolean. 
    - If `isActive` is true, the `active` class will be added to the div. Let's imagine that this active class makes the background light green  to indicate a successful operation.

   - If `isActive` is false, the active class will be removed from the div and the styling reverts to base styling.

- `'text-danger': hasError`
    - When `hasError` is `true`, the `'text-danger'` class would be added. Let's imagine this class makes text inside a message box turn bright red, which immediately sends a visual cue that there is an issue. 

    - When `hasError` is `false`, the `'text-danger'` class is removed. The styling reverts to the base style.


***


**Example 3: bind to a computed property that returns an object**

In a real life scenario, we would use this if we wanted to control data that is derived from other exisiting data.

Implementation

```js 
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}

```


``` html
<div :class="classObject"></div>

```

Code analysis
Scenario Example:

- Initial State:
    - isActive is true
    - error is null
    - classObject will return { active: true, 'text-danger': false }.
    - The div will have the active class applied.

- Something becomes inactive:
    - If you later set this.isActive = false; (e.g., via a button click or other logic):
    - classObject will automatically re-calculate: { active: false, 'text-danger': false }.
    - The active class will be removed from the div.

- A fatal error occurs:
    -  If you set this.error = { type: 'fatal', message: 'Something went terribly wrong!' };
    - classObject will automatically re-calculate: { active: false, 'text-danger': true }. (Because !this.error is now false, active becomes false).
    - The div will have the text-danger class applied, and the active class removed.



***


### Binding to Arrays ###

In a real life scenario we would use this to apply a list of classes 


Implementation
```






```


Code analysis

















***
### Binding with Components ###
## Binding Inline Styles ## 

Bind to appy inline CSS styles to an element
Bind an array of style objects. The styles will be merged together

### Binding to Objects ###
### Binding to Arrays ###
### Auto-Prefixing ### 

You just tell it the standard CSS property you want to use (transform), and Vue figures out if it needs to add special browser-specific versions (-webkit-transform, -moz-transform, etc.) behind the scenes so that your styles look correct in as many browsers as possible, without you having to write all those extra lines of code. This makes your CSS binding cleaner and saves you from manually managing browser compatibility for certain bleeding-edge or older CSS features

### Multiple Values ### 
---
title: Class and Style bindings
description: How to do class and style bindings in Vue.
---


In HTML, a class is a reusable label or category applied to elements, allowing you to group them for consistent styling and behavior (e.g., all "button" elements look the same).

In contrast, an inline style is a direct, one-off instruction applied to a single element for specific visual properties (e.g., making this one paragraph red)

You will learn how to: 
- toggle, add, or remove CSS classes on an element conditionally


## Binding HTML Classes ##

Binding an HTML class allows you to make an automatic connection between a piece of information and whether a certain visual "label" is attached to an HTML element.

For example: If your information says "it's active," the element automatically gets the "active" class. If your information says "it's not active," the element automatically loses the "active" class. 

This makes your web page look and behave differently without you having to write lots of complicated instructions every time something changes. 

### Binding to Objects ###
**Example:**  

In a real life scenario, we would need this if we wanted to control how some content on a webpage appears. 

**Purpose:**
You want to control the appearance of some content  on your webpage 

**Implementation:** Use the following code:

```markdown
<div :class="{ active: isActive }"></div>
```

**Code analysis:**
- `:class` is shorthand for the Vue directive `v-bind`. This is what makes the class attribute dynamic and tells Vue to bind its value to data.

- if `isActive` is true, the content in `div` will have all the defined styles for the `.active` CSS class applied.

- If `isActive` is false, the styles will be removed

*** 


**Example** 

**Purpose:** To dynamically apply multiple CSS classes to an element based on different conditions while still allowing static classes to be used alongside. 

In a real life scenario, we would need this if we wanted to build a dynamic user interface where elements visually respond to changes in your application's state. For example a form filling field which shows errors or valid states for inputed data.


**Implementation:**

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

``` markdown
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


**Example**

**Purpose:** Using computed properties to dynamically apply CSS classes based on component state and error conditions.

This is a common and powerful pattern.

In a real life scenario, we would use this if we wanted to control data that is derived from other exisiting data. For example: a form input field that shows as highlighted when focused but displays in red if there's a validation error.

**Implementation:**

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

**Code analysis:**

- The initial state:
    - `isActive` is `true`
    - `error` is `null`
    - `classObject` will return { active: true, 'text-danger': false }.
    - The `div` will have the active class applied.

- Something becomes inactive:
    - If you later set `this.isActive = false`; (e.g., via a button click or other logic):
    - `classObject` will automatically re-calculate: { active: false, 'text-danger': false }.
    - The `active` class will be removed from the div.

- A fatal error occurs:
    -  If you set `this.error` = { type: 'fatal', message: 'Something went terribly wrong!' };
    - `classObject` will automatically re-calculate: { active: false, 'text-danger': true }. (Because `!this.error` is now false, `active` becomes false).
    - The `div` will have the `text-danger` class applied, and the `active` class removed.


In summary , this code creates a dynamic object that determines which CSS classes should be applied to an element. This `classObject` will automatically update whenever `isActive` or error (or properties within error) change.

***


### Binding to Arrays ###


**Example: Basic Array Syntax**

**Purpose:** Bind `:class` to an array to apply a list of classes to an element

**Implementation:**


```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

```markdown
<div :class="[activeClass, errorClass]"></div>

```


Which will render:
```markdown
<div class="active text-danger"></div>

```

**Code Analysis:**

When these two snippets are used together in a Vue component:

- The data() block sets up two reactive variables, `activeClass` and `errorClass`, holding the strings '`active`' and '`text-danger`' respectively.

- The `<div :class="[activeClass, errorClass]"></div>` line in the template instructs Vue to take the values of these two data properties and add them as CSS classes to the div.

***


**Example: Conditional Classes in Arrays**

**Purpose:** To toggle classes conditionally within the array using ternary expressions, so a class will only apply when isActive is truthy.

**Implementation:**


```markdown
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

**Code Analysis:**

In summary, the functionality of this code is to:

- Conditionally apply one CSS class: The `div` will gain the class specified by `activeClass` only if the `isActive` data property is true. If `isActive` is false, that class will not be present.
- Always apply another CSS class: The `div` will always have the CSS class specified by the `errorClass` data property.

***


**Example: Mixed Syntax**

**Purpose:** to combine the flexibility of both object-based and array-based class binding in a single directive.

It allows a user to apply both static classes (from the array) and conditional classes (from the object)


**Implementation:**


```markdown
<div :class="[{ [activeClass]: isActive }, errorClass]"></div>
```


**Code Analysis:**

This mixed syntax approach is useful when:
-  You have multiple classes that should always be applied,
-  You want to conditionally include classes using ternary operators within the array.

**Real-world benefit:**
Instead of writing separate static classes and conditional logic, you can handle both in one clean expression. This is especially useful for UI components like buttons, form inputs, or cards that need a base set of styling classes plus state-dependent classes.


***


### Binding with Components ###

>This section assumes knowledge of [Components](https://vuejs.org/guide/essentials/component-basics.html). Feel free to skip it and come back later.


When you use the `class` attribute on a component with a single root element, those classes will be added to the component's root element and merged with any existing class already on it.

For example, if we have a component named `MyComponent` with the following template:


```markdown
<!-- child component template -->
<p class="foo bar">Hi!</p>

```

Then add some classes when using it:

```markdown
<!-- when using the component -->
<MyComponent class="baz boo" />

```

The rendered HTML will be:

```markdown
<p class="foo bar baz boo">Hi!</p>
```


The same is true for class bindings:

```markdown
<MyComponent :class="{ active: isActive }" />
```

When isActive is truthy, the rendered HTML will be:

```markdown
<p class="foo bar active">Hi!</p>
```

If your component has multiple root elements, you would need to define which element will receive this class. You can do this using the `$attrs` component property:

```markdown
<!-- MyComponent template using $attrs -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

```markdown
<MyComponent class="baz" />
```

Will render:

```html
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

You can learn more about component attribute inheritance in [Fallthrough Attributes](https://vuejs.org/guide/components/attrs.html) section. 
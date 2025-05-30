---
title: Form Input Bindings
description: How to use form input binding in Vue
---
## What is form input binding? ##

Form input binding is the process of setting up a two way connection between an input form field and a piece of data in your application.

Real Life Application: A shopping cart quantity selector

You are shopping on an e commerce site. You decide you want to purchase 10 items. You use the selector to add '10' in the quantity field. Once this happens, the input binding automatically:
 - updates the quantity of items in your cart 
 - updates the subtotal of your items is recalculates and then 
 - updates your total cart price

In summary, as a result of form input binding, when you change the quantity on data on an input form, and everything related to that quantity on the page reacts in real-time, making for a much smoother and more interactive user experience.

## Implementation ## 
To set up form input binding in Vue, use the `v-model` directive: 

```html
<input v-model="text">
```


Types of forms where you can use form input binding: 

`v-model` can be used on inputs of different types for example:
- Text inputs
- Checkboxes
- Radio buttons
- Select dropdowns  

When you use v-model on different types of form elements, Vue automatically knows how to make the two-way binding work correctly for that specific element type.

Essentially, 
- You don't have to remember different `v-bind` properties and `v-on` events for every type of form element. 
- You just use `v-model`, and Vue handles the underlying technical details of making the two-way binding work correctly for that specific element. 
- It makes your code cleaner, more readable, and less prone to errors.


:::note
v-model will ignore the initial value, checked or selected attributes found on any form elements. It will always treat the current bound JavaScript state as the source of truth. You should declare the initial value on the JavaScript side, using the data option.

:::

***
## Basic Usage ##

## Text Input ##

**Purpose**: Apply form input binding to text input 


**Implementation**: 
``` markdown
<p>Message is: {{ message }}</p>
<input v-model="message" placeholder="edit me" />
```


```
Message is 

```

**Code analysis**:
- `v-model="message"`: This is the core of the two-way binding.

- `v-model` creates a two-way binding between the input field's value and the message data property.

    - Data to Input: When the message variable in your JavaScript changes, the text displayed in the input field will automatically update to that new value.

    - Input to Data: When a user types something into this input field, the message variable in your JavaScript will automatically be updated with whatever the user has typed.

:::note 
For languages that require an IME (Chinese, Japanese, Korean etc.), you'll notice that `v-model` doesn't get updated during IME composition. If you want to respond to these updates as well, use your own `input` event listener and `value` binding instead of using `v-model`.

::: 

***

### Multiline text ###

**Purpose**: Apply form input binding to text that runs on multiple lines

**Implementation**:


```markdown
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```


**Code Analysis**

- `<textarea>` tag: This is an HTML element that  allows users to enter multiple lines of text directly.

- `v-model="message"`: This is the heart of the two-way data binding.
It binds the content of the textarea directly to the message data property in your Vue component.

- Input to Data: When a user types text (including pressing Enter for new lines) into the `<textarea>`, the message variable in your Vue component's data is automatically updated with the full content, including any newline characters.

- Data to Input: If the message variable changes programmatically, the content of the `<textarea>` will reflect that change.


:::note
interpolation inside `<textarea>` won't work. Use `v-model` instead.

Instead of trying to use {{ message }} inside the `<textarea>` tags, you should use the v-model directive directly on the `<textarea>` opening tag: 


```markdown
<!-- bad -->
<textarea>{{ text }}</textarea>

<!-- good -->
<textarea v-model="text"></textarea>
```

:::

***


## Checkbox ##

**Purpose**: to creates an interactive toggle that updates whenever a checkbox is checked or unchecked. 

**Implementation**: 

```html
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>

```


**Code Analysis**: 
- If you click the checkbox, the checkbox's state toggles from unchecked to checked.

- Because of `v-model="checked"`, the checked data property in your Vue component is immediately updated from false to true.

- Since the {{ checked }} in the label is bound to this checked data property, the label text also instantly updates to display: true.


***

### Multiple checked boxes ###

**Purpose**: to create an interactive toggle that updates whenever multiple checkboxes are checked or unchecked.

**Implementation**:

We can also bind multiple checkboxes to the same array or `Set` value:

```js 
export default {
  data() {
    return {
      checkedNames: []
    }
  }
}

```


```markdown
<div>Checked names: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
<label for="mike">Mike</label>
```

**Code Analysis**: 

- `checkedNames` is the name of the data property. `[]` (an empty array) is its initial value.

- When you check "John," the checkedNames array will become ['John'].

- If you then check "Jane," it will become ['John', 'Jane'].

- If you uncheck "John," it will become ['Jane'].

- So, the checkedNames: [] in your script is the storage container for all the values selected by multiple checkboxes that are bound to it.


***


## Radio Buttons ##

**Purpose:**  Creates an "either/or" choice mechanism using radio buttons that updates based on user input.


**Implementation**

```markdown
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>

```

```
Picked: Two
OneTwo

```

**Code Analysis:**


Initial State:
- Let's assume your Vue component's data has `picked: ''` (an empty string) or `picked: 'One'` initially.
- If `picked` is `''`, neither radio button will be checked.
- If `picked` is '`One`', the first radio button will be checked.
- The `div` will display: `Picked:` followed by the initial value of `picked`.

User Selects "`One`":

- The user clicks the radio button labeled "`One`".
- The `v-model="picked`" on that radio button assigns its `value` ("One") to the picked data property. So, `picked` now becomes "`One`".
- Because the `div` is bound to `picked`, it immediately updates to display: `Picked: One`.
- If "Two" was previously selected, `v-model` automatically deselects it.

User Selects "Two":

- The user then clicks the radio button labeled "Two".
- The `v-model="picked`" on that radio button assigns its `value` ("Two") to the `picked` data property. So, `picked` now becomes "`Two`".
- The `div` immediately updates to display: `Picked: Two`.
- The first radio button ("One") automatically becomes deselected because Vue understands that only one radio button bound to the same `v-model` variable can be active.


In summary, when a user selects an option, the picked data property is updated with the value of the chosen radio button, and that chosen value is immediately displayed on the page.


***


## Select Buttons ##

### Single select button ### 


**Purpose:** Use a dropdown menu (select element) in Vue.js to allow a user to choose one option from a list, and how v-model effectively manages that single selection.


**Implementation**

```markdown
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>

```


**Code Analysis:**

This code creates a user-friendly dropdown menu where the currently chosen option's value is stored in the selected data property, and that value is simultaneously displayed live on the page, providing clear feedback to the user.



:::note
If the initial value of your `v-model` expression does not match any of the options, the `<select>` element will render in an "unselected" state. On iOS this will cause the user not being able to select the first item because iOS does not fire a change event in this case. It is therefore recommended to provide a disabled option with an empty value, as demonstrated in the example above.

:::

***


### Multiple select button (bound to array) ###


**Purpose:** allows the user to select multiple options from the drop down list.


**Implementation**


```markdown
<div>Selected: {{ selected }}</div>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>

```

**Code Analysis**

How it works together (Multi-Selection):

- Initial State:
  - You must define selected: `[]` (an empty array) in your Vue component's data.
  - The `<div>` will display: `Selected:`.
  - The multi-select dropdown will be displayed (likely as a box allowing multiple selections, not a single line dropdown) with no options initially selected.

- User Selects "A":
  - The user clicks "A".
  - `v-model="selected"` adds "A" to the selected array. selected becomes [`'A'`].
  - The `<div>` updates to `Selected: A`.

- User Selects "C" (while "A" is still selected):
  - The user holds Ctrl/Cmd and clicks "C".
  - `v-model="selected"` adds "C" to the selected array. selected becomes ['A', 'C'].
  - The `<div>` updates to `Selected: A,C`.

- User Deselects "A":
  - The user holds Ctrl/Cmd and clicks "A" again.
  - `v-model="selected"` removes "A" from the selected array. selected becomes ['C'].
  - The `<div>` updates to `Selected: C`.

This code creates a multi-selection list box where users can choose several options. 

***


## Dynamically rendering select buttons ##


Select options can be dynamically rendered with `v-for:`


**Purpose:**  Create a dynamic dropdown menu, whose options are not fixed or hardcoded directly into the HTML, but rather are generated at runtime based on certain conditions or data.


This pattern is widely used for creating user interfaces where dropdown lists need to be populated from data coming from an API, a database, or other dynamic sources.


**Implementation:**

```js
export default {
  data() {
    return {
      selected: 'A',
      options: [
        { text: 'One', value: 'A' },
        { text: 'Two', value: 'B' },
        { text: 'Three', value: 'C' }
      ]
    }
  }
}

```


```markdown
<select v-model="selected">
  <option v-for="option in options" :value="option.value">
    {{ option.text }}
  </option>
</select>

<div>Selected: {{ selected }}</div>

```

**Code Analysis**

- Component Initialization:
  - Vue sees the `options` array in your data.
  - It then uses `v-fo`r` to loop through options.
  - For the first `option` (`{ text: 'One', value: 'A' }`), it generates `<option value="A">One</option>`.
  - For the second `option` (`{ text: 'Two', value: 'B' }`), it generates `<option value="B">Two</option>`.
  - And so on.
  - The dropdown is populated with "One", "Two", "Three" as visible options.
  - The `selected` display will show the initial value of selected (e.g., empty).

    User Interaction:
  - The user opens the dropdown and selects "Two".
  - The `v-model="selected"` directive automatically updates the selected data property to the value of the chosen option, which is `"B"`.
  - The `<div>Selected: {{ selected }}</div>` instantly updates to display Selected: B.
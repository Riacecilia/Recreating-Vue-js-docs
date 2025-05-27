---
title: Form Input Bindings
description: How to use form input binding in Vue
---
## What is form input binding? ##

Form input binding is the process of setting up a two way connection between an input form field and a piece of data in your application.

For example: 

You are shopping on an e commerce site. You decide you want to purchase 10 items. To do this, you type '10' in the quantity field. Once this happens, the input binding automatically:
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
- text boxes
- check boxes
- radio buttons
- selects  

When you use v-model on different types of form elements, Vue automatically knows how to make the two-way binding work correctly for that specific element type.

Essentially, 
- You don't have to remember different `v-bind`` properties and `v-on` events for every type of form element. 
- You just use `v-model`, and Vue handles the underlying technical details of making the two-way binding work correctly for that specific element. 
- It makes your code cleaner, more readable, and less prone to errors.


:::note
v-model will ignore the initial value, checked or selected attributes found on any form elements. It will always treat the current bound JavaScript state as the source of truth. You should declare the initial value on the JavaScript side, using the data option.

:::

***
## Basic Usage ##

## Text ##

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

```markdown
Multiline message is:

```

**Code Analysis**
 <textarea v-model="message" placeholder="add multiple lines"></textarea>

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

```markdown
[] false 
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

```
Checked names: []
[] Jack  
[] John
[] Mike

```

**Code Analysis**: 

- `checkedNames` is the name of the data property. `[]` (an empty array) is its initial value.

- When you check "John," the checkedNames array will become ['John'].

- If you then check "Jane," it will become ['John', 'Jane'].

- If you uncheck "John," it will become ['Jane'].

- So, the checkedNames: [] in your script is the storage container for all the values selected by multiple checkboxes that are bound to it.


***


## Radio ##


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



***


## Select ##


```markdown
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>

```

:::note
If the initial value of your `v-model` expression does not match any of the options, the `<select>` element will render in an "unselected" state. On iOS this will cause the user not being able to select the first item because iOS does not fire a change event in this case. It is therefore recommended to provide a disabled option with an empty value, as demonstrated in the example above.

:::


Multiple select (bound to array)

```markdown
<div>Selected: {{ selected }}</div>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>

```

Select options can be dynamically rendered with v-for:


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

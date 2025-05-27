---
title: Template Syntax
description: Explaining Vue's template syntax.
---

Vue uses regular HTML to build the look of your website. You add special instructions to this HTML to connect it directly to your data. Template Syntax in Vue is these special rules and elements you add to regular HTML to make your website dynamic and interactive.

Advanced developers who prefer to write code directly instead of using HTML templates, can use JSX. However, using JSX won't get the same speed boosts that Vue's standard HTML templates do.

You need special syntax in Vue in the following scenarios: 
- Text interpolation
- Raw HTML
- Attribute Bindings
- Using JavaScript Expressions
- Directives

## Text interpolation ##  

Text interpolation is a way to insert dynamic data directly into your text or HTML.

**Aim:**

Text interpolation allows you to put a placeholder in your HTML that automatically gets filled in with the correct data from your application.


Imagine a sentence like "Hello, [Name]! Welcome to our website.". Text interpolation allows The placeholder [Name]to be filled with correct user data from the application.

**Implementation**
- use the mustache syntax, also known as double curly braces {{ }} 

```markdown
<span>Message: {{ msg }}</span>

```

**Code analysis**:
- The mustache tag will be replaced with the value of the msg property from the corresponding component instance. 
- It will also be updated whenever the msg property changes.


***


## Raw HTML ##

**Aim**: 

Used when you want to render raw HTML content directly into your component. 

When you use `v-html` on an HTML element, Vue takes the string value you provide to it and inserts that string directly into the element's inner HTML, parsing it as actual HTML.

**Implementation of Raw HTML in Vue**

- use the `v-html` directive

```markdown
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

**Code analysis**:

- the `v-html` directive applies reactive behavior to the rendered DOM. This directive gives the following instruction:  "keep this element's inner HTML up-to-date with the rawHtml property on the current active instance."

- The contents of the span will be replaced with the value of the rawHtml property, interpreted as plain HTML - data bindings are ignored. 

- Note that you cannot use v-html to compose template partials, because Vue is not a string-based templating engine. Instead, components are preferred as the fundamental unit for UI reuse and composition


:::caution
Using `v-html` with content from an untrusted source can cause Cross-Site Scripting (XSS) attacks.  This is when untrusted content contains malicious JavaScript which executes in your users' browsers.

Only use v-html on trusted content and never on user-provided content.
:::

***


## Attribute Bindings ## 

**Aim:**



**Implementing attribute bindings in Vue**

- use `v-bind` directive


```markdown
<div v-bind:id="dynamicId"></div>
```

**Code Analysis:**

- The `v-bind` directive instructs Vue to keep the `id` attribute in sync with the `dynamicId` property. 
- If `dynamicId` is null or undefined, then `id` will be removed from the rendered element.

### Shorthand for Attribute Bindings ###

- `v-bind` has a dedicated shorthand syntax: ` :`

```markdown
<div :id="dynamicId"></div>
```


**Code analysis:**

- Attributes that start with : may look a bit different from normal HTML, but it is in fact a valid character for attribute names and all Vue-supported browsers can parse it correctly. 
- In addition, they do not appear in the final rendered markup. The shorthand syntax is optional, but you will likely appreciate it when you learn more about its usage later.


#### Same-name shorthand syntax #### 

:::note
Only supported in Vue 3.4+
:::


If the attribute has the same name as the variable name of the JavaScript value being bound, the syntax can be further shortened to omit the attribute value:


```markdown
<!-- same as :id="id" -->
<div :id></div>

<!-- this also works -->
<div v-bind:id></div>

```


#### Binding Boolean Attributes ####

**Aim**: 

To you use `v-bind` (or its shorthand `:`) to control HTML attributes that are inherently true or false based on their presence or absence on an element.

**Implementation:**


```markdown
<button :disabled="isButtonDisabled">Button</button>
```


**Code analysis:**
- if `isButtonDisabled` is `true`, Vue adds the disabled attribute to the rendered html element.
- if the value is an empty string, Vue considers it to be `true` and so Vue adds the disabled attribute is added thus maintaining consistency with `<button disabled="">`. 
- if `isbuttonDisabled` is `false`, Vue will remove the rendered html element.


### Dynamically Binding Multiple Attributes ###

**Aim**: 

To dynamically bind multiple attributes to an HTML element at once.

**Implementation**

This code:


```js 
data() {
  return {
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper'
    }
  }
}
```

Can be used like this:

```markdown
<div v-bind="objectOfAttrs"></div>
```

**Code analysis:**



***


## Using JavaScript Expressions ##

So far we've only been binding to simple property keys in our templates. But Vue actually supports the full power of JavaScript expressions inside all data bindings:

```js 
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```


These expressions will be evaluated as JavaScript in the data scope of the current component instance.

In Vue templates, JavaScript expressions can be used in the following positions:
- Inside text interpolations (mustaches)
- In the attribute value of any Vue directives (special attributes that start with `v-`)

### Rules when using JavaScript expressions in Binding ###

1. **Expressions Only**

Each binding can only contain one single expression. An expression is a piece of code that can be evaluated to a value. A simple check is whether it can be used after return.

Therefore, the following will NOT work:

```markdown
<!-- this is a statement, not an expression: -->
{{ var a = 1 }}

<!-- flow control won't work either, use ternary expressions -->
{{ if (ok) { return message } }}
```


2. **Calling Functions**

It is possible to call a component-exposed method inside a binding expression:

```markdown
<time :title="toTitleDate(date)" :datetime="date">
  {{ formatDate(date) }}
</time>
```

:::tip
Functions called inside binding expressions will be called every time the component updates, so they should not have any side effects, such as changing data or triggering asynchronous operations.

:::

3. **Restricted Globals Access**

Template expressions are sandboxed and only have access to a restricted list of [globals](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts#L3). The list exposes commonly used built-in globals such as `Math` and `Date`.


Globals not explicitly included in the list, for example user-attached properties on `window`, will not be accessible in template expressions.


 You can, however, explicitly define additional globals for all Vue expressions by adding them to `app.config.globalProperties`.

***

## Directives ## 
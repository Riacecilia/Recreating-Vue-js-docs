---
title: Plugins
description: A guide to plugins in Vue js.
---

Plugins are self-contained code that add app-level functionality to Vue. 


## Install a plugin ## 

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* optional options */
})
```


A plugin is defined:
-  as an object that exposes an `install()` method,
-  as a function that acts as the install function itself. The install function receives the app instance along with additional options passed to `app.use()`, if any:

```js
const myPlugin = {
  install(app, options) {
    // configure the app
  }
}
```

There is no strictly defined scope for a plugin, but common scenarios where plugins are useful include:

- Register one or more global components or custom directives with app.`component()` and `app.directive()`.

- Make a resource injectable throughout the app by calling `app.provide()`.

- Add some global instance properties or methods by attaching them to `app.config.globalProperties`.

- A library that needs to perform some combination of the above (e.g. vue-router).


***

## Writing a Plugin ##

**Example**

**Purpose:** create a simplified plugin that displays `i18n` (short for Internationalization) strings.


**Implementation**

1. Set up the plugin object. 

Create the plugin object in a separate file and export it, as shown below to keep the logic contained and separate.

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // Plugin code goes here
  }
}
```

2. Create a translation function. 

This function will receive a dot-delimited `key` string, which we will use to look up the translated string in the user-provided options. 


This is the intended usage in templates:

```markdown
<h1>{{ $translate('greetings.hello') }}</h1>
```

3. Make the function globally accessible. 

Attach the function to `app.config.globalProperties` in the plugin:

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // inject a globally available $translate() method
    app.config.globalProperties.$translate = (key) => {
      // retrieve a nested property in `options`
      // using `key` as the path
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

**How this plugin works**

- Our `$translate` function will take a string such as `greetings.hello`, look inside the user provided configuration and return the translated value.

- The object containing the translated keys should be passed to the plugin during installation via additional parameters to `app.use()`:


```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

- Now, our initial expression `$translate('greetings.hello')` will be replaced by `Bonjour!` at runtime.


See also [Augmenting Global Properties](https://vuejs.org/guide/typescript/options-api.html#augmenting-global-properties)


:::tip
Use global properties scarcely, since it can quickly become confusing if too many global properties injected by different plugins are used throughout an app.
:::


## Provide/Inject with plugins ##

Using `provide`, you can give plugin users access to a function or attribute. For example, you can allow the application to have access to the `options` parameter to be able to use the translations object.


```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

Plugin users will now be able to inject the plugin options into their components using the `i18n` key:


```js
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

### Bundle for NPM ###

If you further want to build and publish your plugin for others to use, see [Vite's section on Library Mode](https://vite.dev/guide/build.html#library-mode).
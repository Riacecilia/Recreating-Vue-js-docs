---
title: server side rendering
description: How to use server-side rendering in Vue.js
---
Server side rendering is


## What is SSR?

Vue.js is a framework for building client-side applications. By default, Vue components produce and manipulate DOM in the browser as output. However, it is also possible to render the same components into HTML strings on the server, send them directly to the browser, and finally "hydrate" the static markup into a fully interactive app on the client.

A server-rendered Vue.js app can also be considered "isomorphic" or "universal", in the sense that the majority of your app's code runs on both the server and the client.


### Advantages and Disadvantages of SSR compared with Client Side SPA

#### Advantages

Compared to a client-side Single-Page Application (SPA), SSR has the following advantages: 

- **Faster time-to-content**: this is more prominent on slow internet or slow devices. Server-rendered markup doesn't need to wait until all JavaScript has been downloaded and executed to be displayed, so your user will see a fully-rendered page sooner. In addition, data fetching is done on the server-side for the initial visit, which likely has a faster connection to your database than the client. This generally results in improved Core Web Vitals metrics, better user experience, and can be critical for applications where time-to-content is directly associated with conversion rate.

- **Unified mental model**: you get to use the same language and the same declarative, component-oriented mental model for developing your entire app, instead of jumping back and forth between a backend templating system and a frontend framework.

- **Better SEO**: the search engine crawlers will directly see the fully rendered page.

#### Disadvantages 

There are also some disadvantages to consider when using SSR:

- **Development constraints**. Browser-specific code can only be used inside certain lifecycle hooks; some external libraries may need special treatment to be able to run in a server-rendered app.

- **More involved build setup and deployment requirements**. Unlike a fully static SPA that can be deployed on any static file server, a server-rendered app requires an environment where a Node.js server can run.

- **More server-side load. Rendering a full app in Node**.js is going to be more CPU-intensive than just serving static files, so if you expect high traffic, be prepared for corresponding server load and wisely employ caching strategies.

#### Key considerations before choosing SSR

- Do you actually need SSR for your app? 
- How important is time-to-content for your use case?
  - For apps where an extra few hundred milliseconds on initial load doesnt matter, SSR is too much.
  - For apps where time to content is critical, SSR can help you achieve the best possible initial load performance.


### Comparing Static Site Rendering (SSR) vs Static Site Generation (SSG)

| Feature           | SSR                                                                  | SSG                                                                               |
|-------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| Rendering Process | Renders pages to HTML on the server for each request.                | Pre-renders pages to static HTML at build time.                                   |
| Data Handling     | Suitable for dynamic data that changes frequently.                   | Best for static data that doesn't change frequently. Data is known at build time. |
| Performance       | Excellent time-to-content performance.                               | Excellent time-to-content performance.                                            |
| Deployment        | Cheaper and easier to deploy (static HTML files).                    | More complex and potentially more expensive to deploy.                            |
| Use Cases         | Marketing pages, blogs, documentation sites, content-based websites. | Dynamic web applications, e-commerce sites, personalized content.                 |
| Data Updates      | Requires a new build and deployment to reflect changes.              | Data is updated in real-time with each request.                                   |


## Basic Tutorial


### Example: Rendering an app with SSR

Let's take a look at a basic example of how Vue SSR works.

1.  Create a new directory and `cd` into it
2. Run `npm init -y`
3. Add `"type": "module"` in `package.json` so that Node.js runs in ES modules mode.
4. Run `npm install vue`
5.  Create an `example.js` file:

``` js
// this runs in Node.js on the server.
import { createSSRApp } from 'vue'
// Vue's server-rendering API is exposed under `vue/server-renderer`.
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})

renderToString(app).then((html) => {
  console.log(html)
})
```

6. Run this code:

``` sh 

node example.js 
```

7. You should see this on the command line:

``` html
<button>1</button>
```

`renderToString()` takes a Vue app instance and returns a Promise that resolves to the rendered HTML of the app. It is also possible to stream rendering using the [Node.js Stream API](https://nodejs.org/api/stream.html) or [Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Check out the [SSR API Reference](https://vuejs.org/api/ssr.html) for full details.

We can then move the Vue SSR code into a server request handler, which wraps the application markup with the full page HTML. We will be using `express` for the next steps:

1. Run `npm install express`
2. Create the following `server.js` file:

``` js
import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('ready')
})
```
3. run node server.js and visit http://localhost:3000.
4. You should see the page working with the button.


### Client Hydration
If you click the button, you'll notice the number doesn't change. The HTML is completely static on the client since we are not loading Vue in the browser.

To make the client-side app interactive, Vue needs to perform the hydration step. During hydration, it creates the same Vue application that was run on the server, matches each component to the DOM nodes it should control, and attaches DOM event listeners.

To mount an app in hydration mode, we need to use `createSSRApp()` instead of `createApp()`:

``` js
// this runs in the browser.
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...same app as on server
})

// mounting an SSR app on the client assumes
// the HTML was pre-rendered and will perform
// hydration instead of mounting new DOM nodes.
app.mount('#app')
```

### Code Structure

Notice how we need to reuse the same app implementation as on the server. This is where we need to start thinking about code structure in an SSR app - how do we share the same application code between the server and the client?

Here we will demonstrate the most bare-bones setup. First, let's split the app creation logic into a dedicated file, `app.js`:

``` js
// app.js (shared between server and client)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

This file and its dependencies are shared between the server and the client - we call them universal code. There are a number of things you need to pay attention to when writing universal code, as we will discuss below.

Our client entry imports the universal code, creates the app, and performs the mount:

``` js
// client.js
import { createApp } from './app.js'

createApp().mount('#app')
```

And the server uses the same app creation logic in the request handler:

``` js
// server.js (irrelevant code omitted)
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

In addition, in order to load the client files in the browser, we also need to:

1. Serve client files by adding `server.use(express.static('.'))` in `server.js`.
2.  Load the client entry by adding `<script type="module" src="/client.js"></script>` to the HTML shell.
3.  Support usage like `import * from 'vue'` in the browser by adding an Import Map to the HTML shell.

Try the completed example on StackBlitz. The button is now interactive!


## Recommendations for SSR solutions

Moving from the example to a production-ready SSR app involves a lot more. We will need to:

Support Vue SFCs and other build step requirements. In fact, we will need to coordinate two builds for the same app: one for the client, and one for the server.


In the server request handler, render the HTML with the correct client-side asset links and optimal resource hints. We may also need to switch between SSR and SSG mode, or even mix both in the same app.

Manage routing, data fetching, and state management stores in a universal manner.

A complete implementation would be quite complex and depends on the build toolchain you have chosen to work with. Therefore, we highly recommend going with a higher-level, opinionated solution that abstracts away the complexity for you. Below we will introduce a few recommended SSR solutions in the Vue ecosystem.

### Nuxt

Nuxt is a higher-level framework built on top of the Vue ecosystem which provides a streamlined development experience for writing universal Vue applications. Better yet, you can also use it as a static site generator! We highly recommend giving it a try.


### Quasar

Quasar is a complete Vue-based solution that allows you to target SPA, SSR, PWA, mobile app, desktop app, and browser extension all using one codebase. It not only handles the build setup, but also provides a full collection of Material Design compliant UI components.


### Vite SSR

Vite provides built-in support for Vue server-side rendering, but it is intentionally low-level. If you wish to go directly with Vite, check out vite-plugin-ssr, a community plugin that abstracts away many challenging details for you.

You can also find an example Vue + Vite SSR project using manual setup here, which can serve as a base to build upon. Note this is only recommended if you are experienced with SSR / build tools and really want to have complete control over the higher-level architecture.


## Writing SSR-friendly code
###



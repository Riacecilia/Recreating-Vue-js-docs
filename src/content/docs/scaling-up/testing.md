---
title: testing
description: A guide to testing in Vue.js
---

## Why Test?

Automated tests are important because they:
- help your team build complex Vue applications quickly and confidently 
- prevent regressions 
- encourage you to break apart your application into testable functions, modules, classes, and components. 
- help catch issues and fix them before releasing.
 

In this guide, we'll cover basic terminology and provide our recommendations on which tools to choose for your Vue 3 application.

There is one Vue-specific section covering composables. See Testing Composables below for more details.

## When should you test?

Start testing early.  Begin writing tests as soon as you can. The longer you wait to add tests to your application, the more dependencies your application will have, and the harder it will be to start testing.


## Testing Types

### Summary comparison of the testing types

|               | Unit testing                                                                        | Component testing                                                                                                 | End to End testing                                                                                                                       |
|---------------|-------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| Purpose       | To verify that small, isolated units of code are working as expected.               | To validate a Vue component's behavior as a building block of the UI.                                             | To provide holistic coverage of an application, simulating real user interaction in a production environment.                            |
| Granularity   | Covers a single function, class, composable, or module.                             | Sits above unit testing, focusing on individual Vue components; can be considered a form of integration testing.  | Covers multi-page application behavior; the broadest level of testing.                                                                   |
| Focus         | Logical correctness and a small portion of the application's overall functionality. | The component's public interfaces (props, events, slots) and what the component does, rather than how it does it. | What happens when users actually use your application, including interactions across multiple pages and network requests.                |
| Issues caught | Business logic and logical correctness within a function.                           | Issues related to a component's props, events, slots, styles, classes, and lifecycle hooks.                       | Critical issues with the router, state management, top-level components, public assets, or request handling that other tests might miss. |
| Simplicity    | Relatively simple to write and execute.                                             | Import more code than unit tests, are more complex, and require more time to execute.                             | Involve standing up a database or other backend and may even be run against a live staging environment.                                  |


### Unit testing

#### Unit test example

Take for example this increment function:

``` js
// helpers.js
export function increment(current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

Because this function is self-contained, it's easy to invoke and assert that it returns what it's supposed to. This is why we are writing a Unit Test.

If any of these assertions fail, it's clear that the issue is contained within the increment function.

``` js
// helpers.spec.js
import { increment } from './helpers'

describe('increment', () => {
  test('increments the current number by 1', () => {
    expect(increment(0, 10)).toBe(1)
  })

  test('does not increment the current number over the max', () => {
    expect(increment(10, 10)).toBe(10)
  })

  test('has a default max of 10', () => {
    expect(increment(10)).toBe(10)
  })
})
```

As mentioned previously, unit testing is typically applied to self-contained business logic, components, classes, modules, or functions that do not involve UI rendering, network requests, or other environmental concerns.

These are typically plain JavaScript / TypeScript modules unrelated to Vue. In general, writing unit tests for business logic in Vue applications does not differ significantly from applications using other frameworks.

There are two instances where you DO unit test Vue-specific features:

- Composables
- Components

Composables
​
One category of functions specific to Vue applications is Composables, which may require special handling during tests. See Testing Composables below for more details.

Components
​
A component can be tested in two ways:

- Whitebox (Unit Testing)

Whitebox tests know how a component is built and what it relies on. Their main goal is to test the component by itself. This usually means pretending that some or all of the component's child parts don't exist (this is called "mocking"). You'll also set up any necessary plugins or data that the component uses.

- Blackbox (Component Testing)

Blackbox tests don't know anything about a component's internal workings. These tests try to mock as little as possible. This is to check how well the component works with other parts of the system. They typically show all the child components and are seen as more of an "integration test."


### Component Testing

#### Component testing best practices

DO

- **For Visual logic**: assert correct render output based on inputted props and slots.

- **For Behavioral logic**: assert correct render updates or emitted events in response to user input events.

DON'T

- Don't assert the private state of a component instance or test the private methods of a component. Testing implementation details makes the tests brittle, as they are more likely to break and require updates when the implementation changes.

The component's ultimate job is rendering the correct DOM output, so tests focusing on the DOM output provide the same level of correctness assurance (if not more) while being more robust and resilient to change.

- Don't rely exclusively on snapshot tests. Asserting HTML strings does not describe correctness. Write tests with intentionality.

If a method needs to be tested thoroughly, consider extracting it into a standalone utility function and write a dedicated unit test for it. If it cannot be extracted cleanly, it may be tested as a part of a component, integration, or end-to-end test that covers it.

#### Product Recommendations
​
- Vitest for components or composables that render headlessly (e.g. the useFavicon function in VueUse). Components and DOM can be tested using @vue/test-utils.

- Cypress Component Testing for components whose expected behavior depends on properly rendering styles or triggering native DOM events. It can be used with Testing Library via @testing-library/cypress.

The main differences between Vitest and browser-based runners are speed and execution context. 

-   **Execution context**: Browser-based runners, like Cypress, can catch issues that node-based runners, like Vitest, cannot (e.g. style issues, real native DOM events, cookies, local storage, and network failures), 

-   **Speed** :browser-based runners are slower than Vitest because they open a browser, compile your stylesheets, and more. 

Cypress is a browser-based runner that supports component testing. Please read Vitest's comparison page for the latest information comparing Vitest and Cypress.

- Mounting Libraries
​
Component testing often involves mounting the component being tested in isolation, triggering simulated user input events, and asserting on the rendered DOM output. There are dedicated utility libraries that make these tasks simpler.

-    @vue/test-utils is the official low-level component testing library that was written to provide users access to Vue specific APIs. It's also the lower-level library @testing-library/vue is built on top of.

-   @testing-library/vue is a Vue testing library focused on testing components without relying on implementation details. Its guiding principle is that the more tests resemble the way software is used, the more confidence they can provide.

We recommend using @vue/test-utils for testing components in applications. @testing-library/vue has issues with testing asynchronous component with Suspense, so it should be used with caution.
​
- Nightwatch is an E2E test runner with Vue Component Testing support. (Example Project)

- WebdriverIO for cross-browser component testing that relies on native user interaction based on standardized automation. It can also be used with Testing Library.


### End to End Testing (E2E)

#### Considerations when choosing an E2E testing framework for your application ####
​

While end-to-end (E2E) testing on the web has gained a negative reputation for unreliable (flaky) tests and slowing down development processes, modern E2E tools have made strides forward to create more reliable, interactive, and useful tests. 

- Cross-browser testing
​
One of the main features of end-to-end (E2E) testing is its ability to test your application across multiple browsers. While it may seem desirable to have 100% cross-browser coverage, cross browser testing has diminishing returns on a team's resources due to the additional time and machine power required to run them consistently. Therefore, it is important to be mindful of this trade-off when choosing the amount of cross-browser testing your application needs.

- Faster feedback loops
​
One of the main problems with end-to-end (E2E) tests and development is that running the entire suite takes a long time. Typically, this is only done in continuous integration and deployment (CI/CD) pipelines. 

Modern E2E testing frameworks have solved this problem by adding features like parallelization, which allows for CI/CD pipelines to run faster than before. In addition, modern solutions allow you to selectively run a single test for the page you are working on while providing hot reloading of tests. This boosts a developer's workflow and productivity.

- First-class debugging experience
​
While developers have traditionally relied on scanning logs in a terminal window to help determine what went wrong in a test, modern end-to-end (E2E) test frameworks allow developers to leverage tools they are already familiar with, e.g. browser developer tools.

- Visibility in headless mode
​
When end-to-end (E2E) tests are run in continuous integration/deployment pipelines, they are often run in headless browsers (i.e., no visible browser is opened for the user to watch). 

A critical feature of modern E2E testing frameworks is the ability to see snapshots and/or videos of the application during testing, providing some insight into why errors are happening. Historically, it was tedious to maintain these integrations.

#### Product Recommendations####

- Playwright is a great E2E testing solution that supports Chromium, WebKit, and Firefox. Test on Windows, Linux, and macOS, locally or on CI, headless or headed with native mobile emulation of Google Chrome for Android and Mobile Safari. It has an informative UI, excellent debuggability, built-in assertions, parallelization, traces and is designed to eliminate flaky tests. Support for Component Testing is available, but marked experimental. Playwright is open source and maintained by Microsoft.

- Cypress has an informative graphical interface, excellent debuggability, built-in assertions, stubs, flake-resistance, and snapshots. As mentioned above, it provides stable support for Component Testing. Cypress supports Chromium-based browsers, Firefox, and Electron. WebKit support is available, but marked experimental. Cypress is MIT-licensed, but some features like parallelization require a subscription to Cypress Cloud.

- Nightwatch is an E2E testing solution based on Selenium WebDriver. This gives it the widest browser support range, including native mobile testing. Selenium-based solutions will be slower than Playwright or Cypress.

- WebdriverIO is a test automation framework for web and mobile testing based on the WebDriver protocol.

## How to test in Vue.js

### Adding Vitest to a project

1. In a Vite-based Vue project, run:

``` sh
npm install -D vitest happy-dom @testing-library/vue
```

2. Next, update the Vite configuration to add the test option block:

``` js 
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // enable jest-like global test APIs
    globals: true,
    // simulate DOM with happy-dom
    // (requires installing happy-dom as a peer dependency)
    environment: 'happy-dom'
  }
})
```

3. Then, create a file ending in *.test.js in your project. You can place all test files in a test directory in the project root or in test directories next to your source files. Vitest will automatically search for them using the naming convention.

``` js
// MyComponent.test.js
import { render } from '@testing-library/vue'
import MyComponent from './MyComponent.vue'

test('it should work', () => {
  const { getByText } = render(MyComponent, {
    props: {
      /* ... */
    }
  })

  // assert output
  getByText('...')
})
```

4. update package.json to add the test script 

``` json
{
  // ...
  "scripts": {
    "test": "vitest"
  }
}
```

5. run the test:

``` sh
npm test
```


## Testing Composables

---
title: Quick Start
description: How to start using Vue.js 
---


### Create a Single Page Application with Vue


You will learn how to create a Single Page Application in 7 easy steps.

:::note
Before you start, make sure you have installed the following:
- Node.js version 18.3 or higher (LTS version recommended)
- Code Editor (Visual Studio Code is recommended)
- Terminal/ Command Line

:::


#### Step 1: Open your Terminal or Command Prompt

Navigate to the directory where you want to create your new Vue.js project.

```bash
cd your/preferred/directory
```

#### Step 2: Run `create-vue` to Scaffold Your Project

This is the core scaffolding step. Scaffolding is the process of automatically generating the basic structure, boilerplate code, and configuration files for a new SPA project. `create-vue` is the official tool that will set up your project with sensible defaults and allow you to customize features.

```bash
npm create vue@latest
```

**Explanation of the command:**

* `npm create`: This is a shorthand for `npm init <initializer>`, which runs a package that helps scaffold projects.
* `vue@latest`: This specifies that you want to use the `create-vue` package (the official Vue project scaffolder) and ensures you get the latest version. **It's crucial to include `@latest` to avoid using outdated cached versions.**

#### Step 3: Follow the Interactive Prompts

Once you run the command, `create-vue` will guide you through a series of interactive prompts to configure your project. You can choose the features you want to include:


**Example interaction:**

```
Need to install the following packages:
  create-vue@latest
Ok to proceed? (y) y

Vue.js - The Progressive JavaScript Framework

? Project name: » my-vue-spa
? Add TypeScript? » No / Yes
? Add JSX Support? » No / Yes
? Add Vue Router for Single Page Application development? » Yes
? Add Pinia for state management? » Yes
? Add Vitest for Unit Testing? » No / Yes
? Add an End-to-End Testing Solution? » No / Yes
? Add ESLint for code quality? » Yes
? Add Prettier for code formatting? » Yes
? Add Vue DevTools 7 extension for debugging? (experimental) » No / Yes

Scaffolding project in /Users/youruser/your/preferred/directory/my-vue-spa...

Done. Now run:

  cd my-vue-spa
  npm install
  npm run dev
```

#### Step 4: Navigate into Your Project Directory

After the scaffolding process completes, change your current directory to your newly created project:

```bash
cd my-vue-spa
```

(Replace `my-vue-spa` with the name you chose for your project.)

#### Step 5: Install Dependencies

Your project needs to download all the necessary packages (Vue, Vite, Router, Pinia, etc.) defined in its `package.json` file.

```bash
npm install
```

(Or `yarn install` if you prefer Yarn, or `pnpm install` if you prefer pnpm).

#### Step 6: Start the Development Server

Once dependencies are installed, you can start the development server to see your new Vue.js SPA.

```bash
npm run dev
```

(Or `yarn dev` or `pnpm dev`).

This command will typically start a local development server (often on `http://localhost:5173/` or a similar port). It will also provide Hot Module Replacement (HMR), meaning that changes you make to your code will automatically update in the browser without a full page refresh.

#### Step 7: Open in Your Browser and Start Developing!

Open your web browser and navigate to the URL provided by the `npm run dev` command (e.g., `http://localhost:5173/`). You'll see a basic Vue.js welcome page.

Now you have a fully scaffolded Vue.js SPA ready for development! You can open the project in your code editor and start building out your application's components, routes, and logic.

### Key Things to Know After Scaffolding

* **`src/` directory:** This is where most of your application code will reside.
* **`src/main.js` (or `main.ts`):** The entry point of your application, where Vue is initialized.
* **`src/App.vue`:** The root component of your Vue application.
* **`src/components/`:** A common place to store reusable Vue components.
* **`src/views/` (if you added Vue Router):** Where your main "page" components often live, mapped to different routes.
* **`src/router/index.js` (if you added Vue Router):** Defines your application's routes.
* **`src/stores/` (if you added Pinia):** Where your Pinia stores (for state management) are defined.
* **Vite:** The lightning-fast build tool used by `create-vue`. It provides an incredibly quick development server and optimized production builds.
* **Single-File Components (`.vue` files):** Vue components are typically written in `.vue` files, which combine `<template>`, `<script>`, and `<style>` sections.

You're now ready to build your interactive and dynamic Single Page Application with Vue.js!
# Setting Up Lit

🔄 _Updated on May 22 2023_

📅 _Published on Aug 28 2021_

[Lit](https://lit.dev/) is a library for building [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

Since Lit is distributed as npm packages, before shipping to browser, your code must be **bundled**; and if you use TypeScript for developing, the code must also be **transpiled**. Something must be set up before starting developing with Lit.

However, the initial setup process is not very clearly described in the [official documentation](https://lit.dev/docs/tools/overview/). The [Starter Kit project](https://lit.dev/docs/tools/starter-kits/) is also kind of bloated: You have to install a bundle tool with several plugins, a local web server, some polyfills and even a static site generator, and all of them need to be configured separately.

> *Gone are the days when Notepad program alone is enough for writing websites.*

In this article I'd like to share an alternative, simpler setup to start using Lit. It would serve as a **boilerplate** for building Lit-based web apps. Some goals are:

- TypeScript-based
- For modern browsers only
- As few dependencies as possible, non-bloated
- As few configurations as possible
- Code-splitting: multiple inputs multiple outputs
- Code linting

## Add Lit

Make a directory e.g. "lit-setup", start an npm project:

```bash
mkdir lit-setup
cd lit-setup
npm init -y
```

Then install Lit (as a dependency):

```bash
npm install lit
```

## Directory Structure

We put source files under a `src` directory, target/built files under `dest`, and an additional `assets` for possible static resources such as favicons. Something like this:

```plaintext
.
├── assets  <- favicons, images, manifests...
├── dest    <- target directory to deploy
└── src     <- source files
```

The source code will be processed and put into `dest`, The `assets` would also be copied into `dest`. This `dest` directory can then be deployed.

```bash
mkdir src
mkdir dest
mkdir assets
```

## Bundle Tool

Lit source files must be transpiled and bundled together with Lit library.

When it comes to build/bundle tool there are many choices. Lit officially uses [Rollup](https://rollupjs.org/). I'll be using [esbuild](https://esbuild.github.io/) here, because it:

- Is much, much faster
- Comes with built-in support for
  - Transpiling TypeScript
  - Node module resolution
  - ES code minification

Rollup needs at least three additional plugins for those. Why more dependencies if it can be less? Besides, esbuild is just crazy fast.

```bash
npm install --save-dev esbuild
```

When specifying input files, esbuild doesn't support glob pattern yet, so we could also use [globby](https://github.com/sindresorhus/globby):

```bash
npm i -D globby
```

Then create a function to invoke esbuid:

```js
import {globby} from 'globby';
import {build} from 'esbuild';

const bundle = async () => {
  // get files for bundling
  const entries = await globby('src/**/*.ts');
  // bundle
  return build({
    entryPoints: entries,
    bundle: true,
    format: 'esm',
    splitting: true,
    outdir: 'dest/wc'
  });
};

// call bundle() to trigger the build process
```

Now each time you run `node build.mjs`, esbuild will read every .ts file from `src`, transpile and bundle it, then create the corresponded .js file in `dest/wc` directory. E.g. from `src/foo/foo.ts` to `dest/wc/foo/foo.js`.

Here we added a `wc` (stands for "web component") directory for better organization of target files.

## Add TypeScript

When using esbuild as bundle tool, you don't have to install TypeScript (esbuild implemented its own TypeScript parser). But for linting and/or publishing code, TypeScript is still needed.

```bash
npm i -D typescript
```

### TS Config

Some configs cannot be avoided. Let's start by installing the recommended tsconfig file:

```bash
npm i -D @tsconfig/recommended
```

Then create our `tsconfig.json` (with minimal overwrites):

```json
{
  "extends": "@tsconfig/recommended/tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "experimentalDecorators": true,
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "module": "ES2020",
    "moduleResolution": "node",
    "target": "ES2021"
  },
  "include": ["src/**/*.ts"]
}
```

## Add Lint Tool

[ESLint](https://eslint.org/), what else? Although it does introduce tons of dependencies, static linting for coding is like spell checking for writing: essential.

```bash
npm i -D eslint
```

Configuring ESLint is very easy thanks to its interactive guide:

```bash
npx eslint --init
```

Answer the questions, notably choose `JavaScript modules (import/export)` for module, `None of these` for frameworks, `Yes` for TypeScript, `Browser` for environment and let eslint install dependencies afterwards.

## Local Web Server

Lit's documentation [recommends](https://lit.dev/docs/tools/development/#devserver) using [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/), which means additional installations and configurations.

Alternative: Ubuntu 22.04 has Python installed by default, a (static) web server can be started quickly:

```bash
python -m http.server
```

## Copy Static Assets

We write a function to copy the `assets` directory to `dest`, using the `cpy` package:

```bash
npm i -D cpy
```

```js
import cpy from 'cpy';
// copy assets directory and more
const copy = () => cpy(['assets', 'index.html'], 'dest');
```

## Clean Up

Each build should have a clean start. Again, write a function that utilizes the `del` package:

```bash
npm i -D del
```

```js
import {deleteAsync} from 'del';
// empty the output directory
const clean = () => deleteAsync('dest/*');
```

## Build Script

The final build process should be:

1. Clean up output directory
2. Copy assets
3. Build and bundle source files

Step 1 must be run first, while step 2 and 3 can be run parallel after that. We could utilize `Promise` here for simple "series" and "parallel":

```js
// light parallel
const copyAndBundle = () => Promise.all([copy(), bundle()]);

// series...
clean().then(copyAndBundle);
```

Put together, the complete `build.mjs`:

```js
import {deleteAsync} from 'del';
import cpy from 'cpy';
import { globby } from 'globby';
import { build } from 'esbuild';

// delete dest
const clean = () => deleteAsync('dest/*');

// copy assets
const copy = () => cpy(['assets', 'index.html'], 'dest');

const bundle = async () => {
  // get files for bundling
  const entries = await globby('src/**/*.ts');
  // bundle
  return build({
    entryPoints: entries,
    bundle: true,
    format: 'esm',
    splitting: true,
    outdir: 'dest/wc'
  });
};

// some lite parallel
const copyAndBundle = () => Promise.all([copy(), bundle()]);

// go
clean().then(copyAndBundle);
```

## Example Code

### Web Components

Let's write two Lit-powered web components that do nothing:

Their markups would be:

```html
<ui-foo title="Lit Setup">
  <ui-bar items="Lit,esbuild,TypeScript,ESLint"></ui-bar>
</ui-foo>
```

So, create a `foo.ts` under `src/foo` directory:

```js
import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('ui-foo')
export class Foo extends LitElement {
  static styles = css`h3 {color: darkcyan;}`;

  @property()
  title = 'Untitled';

  render() {
    return html`
      <div class="foo">
        <h3>${this.title}</h3>
        <slot></slot>
      </div>
    `;
  }
}
```

Then a `bar.ts` under `src/bar`:

```js
import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('ui-bar')
export class Bar extends LitElement {
  @property()
  items = '';

  render() {
    return html`
      <ul>
        ${this.items.split(',').map((i, idx) => html`<li class="top${(idx + 1).toString()}">${i}</li>`)}
      </ul>
    `;
  }
}
```

Now run our "build.mjs":

```bash
node build.mjs
```

Under the `dest` directory you'll get the `foo/foo.js` and `bar/bar.js`, as well as a `chunk-XXX.js` which is automatically created by esbuild with the `splitting: true` option, this is basically the Lit library shared by both web components.

Finally we can use the components on our page `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lit Setup</title>
  <script type="module" src="wc/foo/foo.js"></script>
  <script type="module" src="wc/bar/bar.js"></script>
</head>
<body>
  <ui-foo title="Lit Setup">
    <ui-bar items="Lit,esbuild,TypeScript,ESLint"></ui-bar>
  </ui-foo>
</body>
</html>
```

This `index.html` will be copied to `dest` directory after executing `build.mjs`. Now switch to `dest` and start the Python static web server:

```bash
cd dest
python -m http.server
```

Start a browser and visit `http://0.0.0.0:8000/`, you should see the result.

And that's it. The complete source code can be found [here](https://github.com/changke/lit-setup).

🔚

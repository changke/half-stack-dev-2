# Setting Up Lit

🔄 _Updated on Sep 14 2022_

📅 _Published on Aug 28 2021_

[Lit](https://lit.dev/) is a library for building [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

I like Lit, it makes developing with Web Components quicker and easier.

Since Lit is distributed as npm package(s), before shipping to browser, your code must be **bundled**; and if you use TypeScript for developing, the code must also be **transpiled**. You'll need to set something up before start developing with Lit.

However, the initial setup process is not very clearly described in the [official documentation](https://lit.dev/docs/tools/overview/). The [Starter Kit project](https://lit.dev/docs/tools/starter-kits/) is also kind of bloated: You have to install a bundle tool with several plugins, a local web server, some polyfills and even a static site generator, and all of them need to be configured separately.

> *Gone are the days when Notepad program alone is enough for writing websites.*

In this post I'd like to share an alternative, simpler setup to start using Lit. Some goals are:

- TypeScript-based
- For modern browsers only
- Minimal dependencies, non-bloated
- Minimal configs
- Code-splitting: multiple inputs multiple outputs
- Linting
- OS: Ubuntu 22.04, IDE: VS Code

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

## Bundle Tool

Lit source files must be transpiled and then bundled together with Lit library.

When it comes to build/bundle tool there are many choices. Lit officially uses [Rollup](https://rollupjs.org/). I'll be using [esbuild](https://esbuild.github.io/) here, because it:

- Is much, much faster
- Comes with built-in support for
  - Transpiling TS
  - Node module resolution
  - ES code minification

Rollup needs at least three additional plugins for those, why more dependencies if it can be less? Besides, esbuild is just crazy fast.

```bash
npm install --save-dev esbuild
```

When specifying input files, esbuild doesn't support glob pattern yet, so we could also use [globby](https://github.com/sindresorhus/globby):

```bash
npm i -D globby
```

Then create a `build.mjs` for invoking esbuid:

```js
import {globby} from 'globby';
import {build} from 'esbuild';

const entries = await globby('src/**/*.ts');
esbuild.build({
  entryPoints: entries,
  bundle: true,
  format: 'esm',
  splitting: true,
  outdir: 'dest'
});
```

Now each time you run `node build.mjs`, esbuild will read every ts file from "src" folder, transpile and bundle it, then create the corresponded js file in "dest" folder. E.g. from `src/foo/foo.ts` to `dest/foo/foo.js`.

## Add TypeScript

When using esbuild as bundle tool, you don't have to install TypeScript (esbuild implemented its own TS parser). But for linting and/or publishing code, TypeScript is still needed.

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
    "target": "ES2019",
    "module": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "declaration": true,
    "moduleResolution": "node",
    "experimentalDecorators": true
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

Lit's documentation [recommends](https://lit.dev/docs/tools/development/#devserver) using [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/). But why additional installations and configs if you could simply

```bash
python -m http.server
```

Ubuntu 22.04 has Python installed by default, quick and easy.

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

Now run our "build.mjs": `node build.mjs`, under the `dest` directory you'll get the `foo/foo.js` and `bar/bar.js`, as well as a `chunk-XXX.js` which is automatically created by esbuild with the `splitting: true` option, this is basically the Lit library shared by both web components.

Finally we can use the components on our page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lit Setup</title>
  <script type="module" src="dest/foo/foo.js"></script>
  <script type="module" src="dest/bar/bar.js"></script>
</head>
<body>
  <ui-foo title="Lit Setup">
    <ui-bar items="Lit,esbuild,TypeScript,ESLint"></ui-bar>
  </ui-foo>
</body>
</html>
```

And that's it. The complete source code can be found [here](https://github.com/changke/lit-setup).

🔚

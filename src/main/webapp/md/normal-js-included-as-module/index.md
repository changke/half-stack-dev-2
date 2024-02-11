# Normal JavaScript Included As Module

📅 _Published on Wed Sep 06 2023_

We can include a JavaScript module via `script` element: `<script type="module" src="foo.js"></script>`.

But what if this `foo.js` is **not** a module, but just contains normal JS code?

Well, here is a real example from my work:

We have to integrate a third-party library, which will define a global variable. We mistakenly included the library using a `script` tag with `type="module"`, and found that this global variable is undefined.

Turns out that a module has its **own scope**, any variable defined is not available to the global scope unless being exported and imported.

In our case, say our library (lib.js) has following code:

```js
let foo = 'bar';
```

If lib.js is included normally:

```html
<script defer src="lib.js"></script>
```

Then the variable `foo` will be in global scope and can be used by other JS code on the page.

But if lib.js was included as a module:

```html
<script type="module" src="lib.js"></script>
```

Then `foo` will be inside the scope of a module, not global. If other code just tries to use `foo`, an "undefined" exception will be triggered.

See also [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#other_differences_between_modules_and_standard_scripts) and [JSInfo](https://javascript.info/modules-intro#module-level-scope).

> Each module has its own top-level scope. In other words, top-level variables and functions from a module are not seen in other scripts.

So, remember not to use `type="module"` to include non-module JS files, there could be side-effects.

🔚

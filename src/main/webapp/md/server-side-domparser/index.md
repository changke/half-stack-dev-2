# Server-Side DOMParser

📅 _Published: 2024-12-18_

## TL;DR

To use the "real" (native) DOMParser APIs, go for a headless browser:

```js
import puppeteer from 'puppeteer';

// Initialize puppeteer, create page instance etc.
// Launch the browser and open a new blank page
const browser = await puppeteer.launch();
const page = await browser.newPage();

// Must navigate the page to a URL
await page.goto('about:blank');

// Evaluate JavaScript within the context of puppeteer
const result = await page.evaluate(() => {
  const parser = new DOMParser(); // Now we get a native DOMParser!
  return doSomething(parser); // Return a *serializable* value to "result"
});
```

## Introduction

[DOMParser](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser) can make a DOM document object from HTML/XML string, allows us to process HTML/XML source with familiar DOM APIs like `querySelector`. It is available in all browsers from the very beginning, but is not yet part of any server-side JavaScript runtimes such as Node.js or Deno.

Two possible options to use DOMParser on server-side:

1. Use a 3rd-party **library**
2. Use DOMParser from a **headless browser**

## Use 3rd-Party Library

Notable implementations of DOMParser API in server-side JS runtime:

1. Node.js: [JSDOM](https://github.com/jsdom/jsdom) and [Cheerio](https://cheerio.js.org/)
2. Deno: [deno-dom](https://jsr.io/@b-fuze/deno-dom)

Their API syntax may be different than the standard DOMParser API.

This option is quite common and there are many examples. In this article, I want to demonstrate the less-common way: use DOMParser from a headless browser.

We'll find out in the end if it makes any sense.

## Use Headless Browser

One thing I believe headless browser is superior is that, its DOMParser is **native**, plus real DOM versus "virtual" DOM of various libraries.

I'll use [Puppeteer](https://pptr.dev/) to control a headless Chrome browser in Node.js. Another choice can be [Playwright](https://playwright.dev/), which supports more browsers.

The basic idea is to get access to `DOMParser` provided by the browser. For that we need to [execute JavaScript](https://pptr.dev/guides/javascript-execution) in the **context of the page** driven by puppeteer:

```js
// Same code as shown above in TL;DR
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto('about:blank');

const result = await page.evaluate(() => {
  const parser = new DOMParser();
  return doSomething(parser);
});
```

In the code above, the function passed to `page.evaluate()` will be executed in the context of the headless Chrome. It is like you started a Chrome browser, pressed F12 to open DevTools, pasted that piece of code into the console and hit Enter to run it. Naturally we will have full access to the DOM environment, as the `doSomething()` function got an instance of `DOMParser` that came from the browser.

It is important to remember that, the context, in which code inside `evaluate()` is executed, is **different** from the rest of your Node.js code. Means:

```js
let foo = 'bar';
const result = await page.evaluate(() => {
  const parser = new DOMParser();
  return doSomething(parser, foo); // "foo" is undefined here!
});
```

The function passed to `page.evaluate()` does not know `foo` at all, because the variable `foo` is defined in the context of Node, not in the context of headless Chrome.

### Communication Between Contexts

Puppeteer does let the two contexts - headless Chrome and the Node.js - communicate with each other.

1. Through **return value** of `evaluate()`. In the example code above, `page.evaluate()` returns a Promise that can be resolved to `result`, which is in Node.js context, and its value is returned by the `someFunction()`, which is executed in the headless browser context.

2. Through **parameters** passed to the function being evaluated. See example below.

```js
const result = await page.evaluate(
  (a, b) => {
    // a = 1, b = 2
    return a + b;
  },
  1,
  2
);
// result = 3
```

It is important to understand that, only **[serializable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)** variables can be transferred between Node.js and browser contexts. So only primitive data types like number and string, as well as JSON objects can be returned or passed. For example: `1`, `2`, `'foo'`, `{a: 1, b: 2}` etc.. Other complex objects or functions cannot. Otherwise, we could get DOMParser as easily as:

```js
const domParser = await page.evaluate(() => new DOMParser());
// Won't work, "domParser" will be null
// Because complex objects (like DOMParser) cannot be serialized to
// be transferred between contexts
```

The reason why only serializable variables can cross contexts is that, the function passed to `evaluate()` will be converted to a **string** by Puppeteer and "evaluated" in the browser. A function or complex object that cannot be `JSON.stringify()`ed will become null. See also the [documentation here](https://pptr.dev/guides/javascript-execution).

### Use Modules

Actually we can already fully use DOMParser now, as we can put all the code in the evaluated function. For example, a very good use case for DOMParser would be an RSS parser, the code below fetches RSS source data, builds a JSON object and returns it:

```js
// ...
const rssFeedData = await page.evaluate(async url => {
  const resp = await fetch(url);
  const source = await resp.text();
  const doc = new DOMParser().parseFromString(source, 'text/xml');
  const titleNode = doc.querySelector('channel > title');
  const itemNodeList = doc.querySelectorAll('channel > item');
  return {
    title: titleNode.textContent,
    items: Array.from(itemNodeList).map(item => item.querySelector('title').textContent)
  };
}, feedUrl);

// rssFeedData = {
//   title: '...',
//   items: ['...', '...', '...']
// }
```

However, in real world you'll write modular code instead of fat functions. For example, there could be a dedicated function or class that parses and builds the RSS feed data. Such function, as explained above, cannot be directly passed to `page.evaluate()`, how can we execute it then in the browser context?

#### Global Inclusion

Option 1: Like in the old days, when people use too many jQuery plug-ins, each one would introduce a global object through `<script>` tag. We could make the RSS parser function globally accessible in the browser context.

Puppeteer supports adding JS files directly into the browser context as if using `<script>` tag:

```js
// add a <script> tag, the source file is "rssparser.js" in the current working directory
await page.addScriptTag({path: 'rssparser.js'});
```

Let's write a `RSSParser` class to handle the XML-parsing and JSON-building job:

```js
class RSSParser {
  _domParser = null;

  constructor(domParser = undefined) {
    if (domParser) {
      this._domParser = domParser;
    }
  }

  set domParser(parser) {
    this._domParser = parser;
  }

  parse(html) {
    const result = {};
    if (this._domParser) {
      const doc = this._domParser.parseFromString(html, 'text/xml');
      const title = doc.querySelector('channel > title');
      result.title = title.textContent;
      const items = doc.querySelectorAll('channel > item');
      result.items = Array.from(items).map(item => item.querySelector('title').textContent);
    }
    return result;
  }
}
```

We put this class in a `rssparser.js` file, it is then accessible with:

```js
// ...
await page.addScriptTag({path: 'rssparser.js'});

const rssFeedData = await page.evaluate(async url => {
  const resp = await fetch(url);
  const source = await resp.text();
  // RSSParser class is introduced to global/window namespace
  // by a <script> tag through addScriptTag() method
  const rssParser = new window.RSSParser(new DOMParser());
  return rssParser.parse(source);
}, feedUrl);
```

#### Dynamic Module Importing

Option 2: With `import()` expression we can dynamically import module from external files. So we can change the code above, instead of directly using `window.RSSParser` we import it first:

```js
// Does this line work?
const rssParserClass = (await import('./rssparser.js')).default;
```

Again, this line of code does not work as intended. Why? because once again `./rssparser.js` is located in Node's context (`cwd()`). It doesn't exists in headless Chrome's context.

A workaround could be that we read the content of `rssparser.js` in Node, and pass it as a string parameter to the `evaluate()` method. Then within the browser context, we can "import" this string becasue `import()` [supports also Data URLs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#module_specifier_resolution):

```js
const cls = await readFile('./rssparser.js', {encoding: 'utf8'});
await page.evaluate(async classSrc => {
  // import with Data URL
  const rssParserClass = (await import(`data:text/javascript,${classSrc}`)).default;
}, cls);
```

Furthermore, Puppeteer provides an API [`Page.exposeFunction()`](https://pptr.dev/api/puppeteer.page.exposefunction) that allows a function defined in Node to become callable in the browser context. So we could also expose Node's `readFile` function to the browser and make the importing more "in-place" and "on-demand":

```js
// We expose this "readFile" function to browser context
// It is then callable like a global object
await page.exposeFunction('readFile', async filePath => {
  try {
    const c = await readFile(filePath, {encoding: 'utf8'});
    return c;
  } catch (err) {
    console.error(err.message);
  }
});

const result = await page.evaluate(async xmlSrc => {
  let cls = window.RSSParser;
  if (!cls) {
    cls = await window.readFile('./rssparser.mjs'); // here we have it!
    cls = window.RSSParser = (await import(`data:text/javascript,${cls}`)).default;
  }
  const rssParser = new cls();
  rssParser.domParser = new DOMParser();
  return rssParser.parse(xmlSrc);
}, rssSourceAsString);
```

And now we can use `DOMParser` on server-side in "proper" modular way.

## Summary

As shown above, to use `DOMParser` in a server-side JavaScript runtime such as Node.js or Deno, besides using a 3rd-party library, it is also possible to use the "native" DOMParser object provided by a headless browser. However, the latter requires some workarounds and is much less intuitive.

Regarding performance, in my benchmark (with [Autocannon](https://github.com/mcollina/autocannon)) using a headless browser is about 5 times slower than using a library.

So, the recommended way to use DOMParser on server-side is to use a library like [deno-dom](https://jsr.io/@b-fuze/deno-dom). We demonstrated in this article that although possible, using DOMParser from a headless browser is neither straightforward nor performant.

🔚

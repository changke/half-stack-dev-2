# Experiencing JSR

📅 _Published: 2025-01-10_

The [JavaScript Registry](https://jsr.io/) (JSR) is a modern package registry for JavaScript and TypeScript. It was created by the [Deno](https://deno.com/) company.

You can publish packages written in TypeScript-only to JSR. When such package is installed with npm, it will be automatically transpiled after installation to become usable in JavaScript code.

```bash
npx jsr add @foo/bar
```

This cool feature sticks to Deno's origin idea of being a build-less, bundle-less, tooling-less runtime.

🔚

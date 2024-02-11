# How to Lint Lit Styles

📅 _Published on Mon Jun 05 2023_

Normally CSS styles of a Lit component is written as a .ts file so typical style linter will not check against it.

There are two options to do linting for lit style file:

1. Using an IDE plugin
2. Using Stylelint

## Lit Plugin for IDE

For VS Code there is [a plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin), once installed, when editing files containing lit styles, possible errors will be automatically highlighted.

More details are [described in Lit doc](https://lit.dev/docs/tools/development/#lit-plugin).

## Stylelint with Plugin

[Stylelint](https://stylelint.io/) seems to be the "ESLint for CSS" now.

With Stylelint we can do linting from command line without an IDE.

Lint for lit styles is done via "[postcss-lit](https://www.npmjs.com/package/postcss-lit)", a PostCSS plugin.

### Install Stylelint and Plugins

```bash
npm install --save-dev stylelint stylelint-config-standard postcss-lit
```

### Config Stylelint

Create a file named `.stylelintrc.json` with following Stylelint configuration:

```json
{
  "extends": ["stylelint-config-standard"],
  "overrides": [
    {
      "files": ["*.ts"],
      "customSyntax": "postcss-lit"
    }
  ],
  "rules": {
    "media-feature-range-notation": null
  }
}
```

With this config, Stylelint will use its "standard" syntax to lint all supported files, but for ".ts" files, which are lit styles, it will use "custom" syntax defined in the `postcss-lit` plugin.

I also deactivated one rule, because at the time of writing, the lit VS Code plugin does not yet support the new media query range notation (`min-width: 768px` OK but `width >= 768px` not).

### Executing Stylelint

You can either use `npx` or through a `scripts` field in `package.json` to execute Stylelint:

```bash
npx stylelint "src/**/*.{css,ts}"
```

or

```json
{
  "scripts": {
    "lint": "stylelint src/**/*.{css,ts}"
  }
}
```

then

```bash
npm run lint
```

Actually these steps are already present on [Stylelint's homepage](https://stylelint.io/user-guide/get-started#using-a-custom-syntax-directly).

That's it and happy linting!

🔚

# Chrome Mobile Font Size Issue

📅 _Published on Sat Oct 21 2023_

Recently, while browsing my [personal blog](https://blog.sinzy.net/@why) on my Tablet with Chrome (mobile), I noticed sometimes the font size seems to be larger than what I defined in CSS.

Often, if I scroll a bit, the font size then becomes smaller to its correct value.

This doesn't happen to all pages, but especially frequent for pages with lots of text, like a blog post page.

This bothers me.

Turns out it is an old "feature" of mobile browsers to "enhance" readability of web pages on mobile screen.

I found the explanation and solution firstly on [this post](https://benedikt.io/2021/04/android-chrome-edge-aendern-schriftgroesse-scrollen-font-boosting-blink-bug/) (in German).

The cause is (the lack of) [`text-size-adjust` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust).

> The `text-size-adjust` CSS property controls the text inflation algorithm used on some smartphones and tablets. Other browsers will ignore this property.

So, by setting

```css
html {
  text-size-adjust: 100%; /* can also be none */
}
```

Issue solved.

BTW, this property is present in the (once) popular [Normalize.css](https://necolas.github.io/normalize.css/) from the beginning. The original goal was to "prevent adjustments of font size after orientation changes in iOS."

🔚

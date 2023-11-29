# emulate.js

## What is this?

A tiny JavaScript library to emulate `:active` styles on mobile devices.

## Why?

Because `-webkit-tap-highlight-color` is ugly and almost always hidden with a transparent color.

## Seriously?

Yes. Everything must be modularized and served over a CDN.

## Demo?

[Here's the CodePen.](https://codepen.io/citrusui/pen/zoPBGx)

## Notes

I did not blatantly copy and paste this code from CSS-Tricks. The original version was a [jQuery snippet](https://twitter.com/citrusui/status/748185011577364480) which I learned to [adapt](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) for use without jQuery. Upon a quick Google search, I realized CSS-Tricks [already did this](https://css-tricks.com/snippets/css/remove-gray-highlight-when-tapping-links-in-mobile-safari/) in 2011. So I thought I might as well credit them.

Licensed under [CSS-Tricks](LICENSE.md).

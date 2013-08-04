pure-js-carousel
================

A very simple, pure JavaScript carousel written in 3 days for an interview. I promise I have not changed this 
since the interview.

Requirements
============

This carousel must:

1. Should be written using HTML(5)/CSS(3)/Javascript.
2. Should be full-frame (fill the whole browser window).
3. No JS library (ex: YUI, jquery, backbone, etc.).
4. Must work in either latest Chrome or Firefox (Bonus for extra compatibility).

Features
========

This is a click and drag version that is fully linted and takes event propagation into account. Some key features to note:

1. This uses propagating mouse events to determine which elements the mouse is currently in so that the carousel does not accidentally stop.
2. This code is fullly linted
3. This code uses the revealing module pattern, which allows for hot fixes and method overwrites from other programs
4. All assets are lazy loaded (loaded after DOM ready)
5. This code, for simplicity, stays away from the use of this, call, and apply (as recommended by Douglas Crockford).
6. The log function is used so that browsers that don't have a console are not affected (as recommended by Paul Irish).
7. If a class is not instantiated with the new operator, the class will return itself instantiated with the new operator to keep the prototype chain
8. The onReady event is handeled as modernly as possible, and falls back to window onload for older browsers.

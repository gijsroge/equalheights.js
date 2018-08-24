# EqualHeights.js

Lightweight, es6 module to set equal height to html elements.

[![Build Status](https://travis-ci.org/gijsroge/equalheights.js.svg?branch=master)](https://travis-ci.org/gijsroge/equalheights.js)

## Usage
add js-equal-height to each parent element
Inside those js-equal-height element you can define regions that has to have the same height by adding a data attribute `data-equal-height="place a unique name here"`

Also take a look in [dist/index.html](dist/index.html)

## Warning
Collapsing margins are not supported. The element where the data-equal-height is place on can not have collapsing margins inside. There are ways to prevent them. E.g. adding `padding-bottom: 1px` to the element. Or `overflow: auto;`
## Features

* Flexible.
* Public methods to recalculate heights.
* ES6 Module or as a standalone library.

This is still a work in progress, more documentation coming soon.

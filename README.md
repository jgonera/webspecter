WebSpecter
==========

WebSpecter is a an acceptance test framework for web applications. It
simulates how a real user would interact with a web browser using BDD-style
tests written in CoffeeScript or JavaScript. A simple test example:

```coffeescript
feature "GitHub search", (context, browser, $) ->
  before (done) -> browser.visit 'https://github.com/search', done

  it "finds WebSpecter", (done) ->
    $('input[name=q]').fill 'webspecter'
    $(button: 'Search').click ->
      $(link: "jgonera / webspecter").present.should.be.true
      done()
```


Installation
------------

WebSpecter runs on [PhantomJS][] (*not* Node.js). It is the only dependency
that needs to be installed manually.

As of now, compatibility with older versions of PhantomJS is not a priority
so if something doesn't work, please install the latest stable version of
PhantomJS.

Since PhantomJS doesn't have any package manager you install WebSpecter by
cloning the repo with submodules:
```bash
git clone https://github.com/jgonera/webspecter.git --recursive
```

Then create a symlink to `webspecter/bin/webspecter` in `~/bin` or
`/usr/local/bin` or add `webspecter/bin` to `PATH`.

Once WebSpecter is correctly installed, this should work:
```bash
$ webspecter --version
0.1.0dev
```


Basic usage
-----------

Tests can be written in JavaScript or [CoffeeScript][]. The examples in the
docs use the latter.

Running `webspecter <path>` will run all the tests in the given path, which
can be either a directory or a specific file. If path is a directory, all
files with `.js` and `.coffee` extensions will be loaded.

Every test must contain a feature, like so:

```coffeescript
feature "Feature name", (context, browser, $) ->
  # test cases follow
```

Inside a feature, standard BDD syntax is used to describe test cases. `it`
keyword denotes a single test and `describe` can be used to group tests.
Moreover, `before`, `after`, `beforeEach`, and `afterEach` are also
available.  [Mocha][] is the framework used internally, see its
documentation for details.

[Chai][] is used as an assertion library. All of its three interfaces
(`should`, `expect` and `assert`) can be used.

Each feature has its own `context`, `browser` and a jQuery-like function
`$`. jQuery is *not* used internally, so don't expect 100% compatibility.

See details below on how to use them.


### Browser

Browser is used to navigate web sites in tests. It's a wrapper for
PhantomJS's WebPage.


#### Properties and methods

##### `#visit`
Visits a URL.

```coffeescript
beforeEach (done) -> browser.visit 'http://google.com/', done
```

##### `#evaluate`
Evaluates code in web site's context.

```coffeescript
windowWidth = browser.evaluate -> window.innerWidth
```

##### `.url`
Contains current URL.


### $

Finds elements on the web site. If the argument is a string it treats it as
a CSS selector. If the arguments is an object, it can have one of the
following forms:

`$(button: "Button caption")`, finds buttons with the specified caption
(either `<button>` or `<input>`).

`$(field: "Field label")`, finds inputs and textareas with specific label,
id or placeholder.

`$(link: "Text")`, finds links with specific text.

`$(text: "Text")`, finds elements with specific text.

`$(xpath: 'XPath query')`, finds elements using XPath, e.g.
`//li[text()="special"]` finds all `<li>` elements that contain the text
"special".


#### Properties and methods of returned objects

`$` returns an object with the following properties and methods that can let
you inspect and manipulate web site's elements.

##### `.present`
True if the element is present.

```coffeescript
$('h1').present.should.be.true
```

##### `.visible`
True if the element is visible.

##### `.text`
Element's text contents.

##### `.value`
Input's or textarea's value.

##### `.checked`
True for checked radioboxes and checkboxes.

##### `#attr(name)`
Value of element's `name` attribute.

##### `#style(name)`
Value of element's `name` CSS property.

```coffeescript
$('header').style('color')
```

##### `#fill(value)`
Fills an input or textarea with `value`.

##### `#type(text)`
Types `text` into an input or textarea by sending a JavaScript `TextEvent`.

##### `#check`
Checks a checkbox or radiobox.

##### `#uncheck`
Unchecks a checkbox.

##### `#select(option)`
Selects an option in `<select>` by its name.

##### `#submit`
Submits a `<form>`.

##### `#click`
Clicks the element. If an argument is given it's treated as a callback that
will be run after the page is loaded (e.g.  after submitting the form).


#### Multiple elements

When more than one element is returned by a query, by default all the
methods apply to the first element from the list. You can access consecutive
elements with an array-like syntax:

```coffeescript
$('#somelist li')[2] # selected the third <li>
```

You can also iterate over all elements:

```coffeescript
$('#somelist li').each (element) ->
  element.text.should.include 'item'
```


[Chai]: http://chaijs.com/
[CoffeeScript]: http://coffeescript.org/
[Mocha]: http://visionmedia.github.com/mocha/
[PhantomJS]: http://phantomjs.org/

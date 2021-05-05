**DISCLAIMER: This project is no longer maintained. If you wish to take it over, let me know.**

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


Usage
-----

**Important:** WebSpecter is in early development stage. API may still change.

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

Apart from `feature`, WebSpecter adds two other global keywords to the DSL:
`wait` and `parallelize`.

See details below on how to use all the features or [WebSpecter examples][]
for more real life use cases.


### Browser object

Browser is used to navigate web sites in tests. It's a wrapper for
PhantomJS's WebPage.


#### Properties and methods

##### `url`
Contains current URL.

##### `visit(url, [callback])`
Visits a URL. If callback is provided it is called after the page is loaded.

```coffeescript
beforeEach (done) -> browser.visit 'http://google.com/', done
```

##### `evaluate(fn)`
Evaluates code in web site's context.

```coffeescript
windowWidth = browser.evaluate -> window.innerWidth
```


### $ function

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

##### `present`
True if the element is present.

```coffeescript
$('h1').present.should.be.true
```

##### `visible`
True if the element is visible.

##### `text`
Element's text contents.

##### `value`
Input's or textarea's value.

##### `checked`
True for checked radioboxes and checkboxes.

##### `attr(name)`
Value of element's `name` attribute.

##### `style(name)`
Value of element's `name` CSS property.

```coffeescript
$('header').style('color') # returns color of the <header> element
```

##### `fill(value)`
Fills an input or textarea with `value`.

##### `type(text)`
Types `text` into an input or textarea by sending a JavaScript `TextEvent`.

##### `check()`
Checks a checkbox or radiobox.

##### `uncheck()`
Unchecks a checkbox.

##### `select(option)`
Selects an option in `<select>` by its name.

##### `submit([callback])`
Submits a `<form>` and calls optional callback. Example:

```coffeescript
$('form').submit ->
  $('p#flash').text.should.include "successfully submitted"
```

##### `click([callback])`
Clicks the element. If an argument is given it's treated as a callback that
will be run after the page is loaded (e.g. after submitting the form).

##### `is`

`is` contains the following functions: `is.present()`, `is.visible()`,
`is.checked()`. They return the same values as the properties mentioned before.
They can be used as a condition function in the [`wait` functions](#wait).


#### Multiple elements

When more than one element is returned by a query, by default all the
methods apply to the first element from the list. You can access consecutive
elements with an array-like syntax:

```coffeescript
$('#somelist li')[2].text # access the third <li>'s text
```

You can also iterate over all elements:

```coffeescript
$('#somelist li').each (element) ->
  element.text.should.include 'item'
```


### Context object

The `context` object contains the whole environment for a particular
feature. In fact, it also contains the `browser` object and `$` function. It
also contains all the helper functions defined in the
[environment file](#environment-file).

The `context` object contains the default context for the feature, but you
can create multiple contexts using `context.newContext()`. This can be used
to simulate multiple users interacting with your web application at the same
time.

For a complete example of such use case see `examples/stypi.coffee`.


#### Properties and methods

##### `browser`
Returns the browser object for the context.

##### `$(selector)`
The `$` function.

##### `newContext([name])`
Returns a new context with optional `name`.

##### `include(path)`
Includes additional helper functions in the context from a file defined by
`path`. See [Defining helpers](#defining-helpers) for details.


#### Defining helpers

Every context can include helper functions. Helper functions defined in the
[environment file](#environment-file) are available in new contexts by
default. However, you can also include helpers from other files.

When defining helpers `this` is set to the context so that you can use
context's browser and `$` function inside them (`@browser` and `@$` in
CoffeeScript, `this.browser` and `this.$` in JavaScript).

Example:

```coffeescript
# my_helpers.coffee
exports.helpers =
  sendMessage: (text) ->
    @$(field: "Message").fill text
    @$(button: "Send").click()

# my_feature.coffee
feature "Messages", (context, browser, $) ->
  context.include 'my_helpers.coffee'

  it "displays sent messages", ->
    context.sendMessage "test message"
    $('#messages').text.should.include "test message"
```


### Environment file

There is one special file which you can put in the tests directory, called
`env.coffee` or `env.js`. This file can contain global configuration for all
the features, additional selectors for the `$` function and default helper
functions for contexts. Example:

```coffeescript
exports.config =
  baseUrl: 'http://localhost:3001'
  
exports.selectors =
  tea: (query) -> xpath: "//*[text()='#{query} tea']"

exports.helpers =
  pageTitle: -> @$('h2').text
```

#### `config`

Contains global configuration for all the features.

##### `config.baseUrl`
A string that will be prepended in all `browser.visit()` calls so that
instead of repeating the host and port in all the features, you can simply
write `browser.visit('/path')` and it will visit `baseUrl + '/path'`.


#### `selectors`

Additional selector for the `$` function. The example above adds the
following:

```coffeescript
$(tea: 'black') # will select all elements whose text is "black tea"
```


#### `helpers`

Default helpers defined in a way described in [Defining helpers](#defining-helpers).


### Additional global keywords

#### `wait`

Very often when you test web applications you might want to wait until
something happens (e.g. a DOM element appears) before continuing the test. You
can do it using the `wait.while()` and `wait.until()` functions.

Both functions receive two functions as their arguments: a condition function
and a callback. For `wait.until()` the condition function is checked constantly
until it returns `true` and then the callback is called. For `wait.while()` the
callback is called when the condition function returns `false`.

Optionally, the second argument can be an object with the following options:
`for` which sets the timeout in ms and `message` which sets a custom error
message if the timeout is reached. The error message can be also set by
creating a `message` attribute in the condition function.

Examples:

```coffeescript
$('#addWithDelay').click()
wait.until $('#delayed').is.present, ->
  $('#delayed').text.should.equal 'something'
  done()
```

```coffeescript
appReady = ->
  browser.evaluate -> window.appReady
appReady.message = "Timed out waiting for the app to be ready"

wait.until appReady, for: 1000, ->
  $('#workspace').present.should.be.true
  done()
```


#### `parallelize`

In certain situations you may want several asynchronous tasks to be performed
in parallel (e.g. registering two users accounts at the same time). You can
achieve this by using `parallelize`. It accepts a single argument which is the
number of tasks to be performed simultaneously and returns a function which can
be used instead of `done`.

Example:

```coffeescript
alice = context.newContext()
bob = context.newContext()
parallel = parallelize 2

# register two users in parallel (createUser is a helper)
alice.createUser aliceUser, parallel
bob.createUser bobUser, parallel
parallel.done =>
  # do something more
  done()
```


Development
-----------

If you want to add something to WebSpecter, remember to write tests for it.
Tests are also written using Mocha. You can run the whole WebSpecter test suite
with the following command:

```bash
make test
```

This automatically starts the test web application before running tests. The
test web app can be found in `support/server` and requires [Node.js][].


[Chai]: http://chaijs.com/
[CoffeeScript]: http://coffeescript.org/
[Mocha]: https://mochajs.org/
[Node.js]: http://nodejs.org/
[PhantomJS]: http://phantomjs.org/
[WebSpecter examples]: https://github.com/jgonera/webspecter/tree/master/examples

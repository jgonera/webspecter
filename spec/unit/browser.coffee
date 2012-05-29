Browser = require '../../Browser'
PageQuery = require '../../PageQuery'
{config} = require '../../environment'
config.baseUrl = 'http://localhost:4567'


describe 'Browser', ->
  browser = null
  
  beforeEach ->
    browser = new Browser

  it "doesn't set onConsoleMessage if console option is disabled", ->
    config.console = false
    logged = false
    oldConsoleError = console.error
    console.error = -> logged = true
    browser = new Browser
    browser.page.evaluate -> console.log 'test'
    console.error = oldConsoleError
    logged.should.equal false

  it "sets onConsoleMessage if console option is enabled", ->
    config.console = true
    logged = false
    oldConsoleError = console.error
    console.error = -> logged = true
    browser = new Browser
    browser.page.evaluate -> console.log 'test'
    console.error = oldConsoleError
    logged.should.equal true
  
  describe '#visit', ->
    it "loads the page", (done) ->
      browser.visit 'http://localhost:4567', ->
        title = browser.page.evaluate ->
          document.querySelector('title').textContent
        title.should.equal 'WebSpecter Test Server'
        done()
      
    it "loads the subpage using config's baseUrl", (done) ->
      browser.visit '/subpage', ->
        title = browser.page.evaluate ->
          document.querySelector('title').textContent
        title.should.equal 'WebSpecter Test Server'
        done()
    
    it "sets the URL", (done) ->
      browser.visit 'http://localhost:4567', ->
        browser.initialUrl.should.equal 'http://localhost:4567'
        browser.url.should.equal 'http://localhost:4567/'
        done()
  
  describe '.url', ->
    beforeEach (done) ->
      browser.visit 'http://localhost:4567', ->
        browser.query(link: 'subpage').click(done)
        
    it "is the current URL", ->
      browser.url.should.equal 'http://localhost:4567/subpage'
      
  describe '#query', ->
    it 'returns a PageQuery object', ->
      browser.query('body').should.be.an.instanceOf PageQuery
  
  describe '#onceLoaded', ->
    it 'runs the callback after the page is loaded', (done) ->
      browser.onceLoaded done
      browser.visit 'http://localhost:4567'
    
    it 'runs the callback if the page is already loaded', (done) ->
      calls = 0
      browser.visit 'http://localhost:4567'
      setTimeout (->
        browser.onceLoaded done
      ), 500
  
  describe '#reload', ->
    beforeEach (done) ->
      browser.visit 'http://localhost:4567', ->
        browser.query(link: 'subpage').click(done)
      
    it "reloads the current URL", (done) ->
      reloaded = false
      browser.onceLoaded -> reloaded = true
      browser.reload ->
        reloaded.should.equal true
        browser.url.should.equal 'http://localhost:4567/subpage'
        done()
  
  describe '#reloadInitial', ->
    beforeEach (done) ->
      browser.visit 'http://localhost:4567', ->
        browser.query(link: 'subpage').click(done)
      
    it "reloads the initial URL loaded with #visit", (done) ->
      reloaded = false
      browser.onceLoaded -> reloaded = true
      browser.reloadInitial ->
        reloaded.should.equal true
        browser.url.should.equal 'http://localhost:4567/'
        done()

  describe '#evaluate', ->
    it "evaluates the function in page context with supplied arguments", ->
      message = ''
      browser.page.onConsoleMessage = (msg) -> message = msg
      browser.evaluate 'abc', (text) -> console.log text
      message.should.equal 'abc'

    it "returns the value", ->
      result = browser.evaluate -> 'hello'
      result.should.equal 'hello'

Browser = require '../../Browser'
PageQuery = require '../../PageQuery'


describe 'Browser', ->
  browser = null
  
  beforeEach ->
    browser = new Browser
  
  describe '#visit', ->
    beforeEach (done) -> browser.visit 'http://localhost:4567', done
    
    it "loads the page", ->
      title = browser.page.evaluate ->
        document.querySelector('title').textContent
      title.should.equal 'WebSpecter Test Server'
    
    it "sets the URL", ->
      browser.initialUrl.should.equal 'http://localhost:4567'
      browser.url.should.equal 'http://localhost:4567/'
  
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
        

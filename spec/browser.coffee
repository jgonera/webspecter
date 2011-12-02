Browser = require '../Browser'
PageQuery = require '../PageQuery'


describe 'Browser', ->
  browser = null
  
  beforeEach ->
    browser = new Browser
  
  describe '#query', ->
    it 'returns a PageQuery object', ->
      (browser.query('fake') instanceof PageQuery).should.be.ok
  
  describe '#onLoaded', ->  
    it 'runs the callback if the page after the page is loaded', (done) ->
      calls = 0
      browser.onLoaded -> calls += 1
      browser.get 'http://localhost:4567'
      setTimeout (->
        try
          calls.should.be.equal 1
          done()
        catch e
          done(e)
      ), 100
    
    it 'runs the callback if the page is already loaded', (done) ->
      calls = 0
      browser.get 'http://localhost:4567'
      setTimeout (->
        browser.onLoaded -> calls += 1
        try
          calls.should.be.equal 1
          done()
        catch e
          done(e)
      ), 100

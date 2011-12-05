Browser = require '../../Browser'
PageQuery = require '../../PageQuery'


describe 'Browser', ->
  browser = null
  
  beforeEach ->
    browser = new Browser
  
  describe '#query', ->
    it 'returns a PageQuery object', ->
      browser.query('body').should.be.an.instanceOf PageQuery
  
  describe '#onLoaded', ->  
    it 'runs the callback after the page is loaded', (done) ->
      browser.onLoaded done
      browser.get 'http://localhost:4567'
    
    it 'runs the callback if the page is already loaded', (done) ->
      calls = 0
      browser.get 'http://localhost:4567'
      setTimeout (->
        browser.onLoaded done
      ), 500

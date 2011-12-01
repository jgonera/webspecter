feature 'Queries', 'http://localhost:4567', ->
  it 'has title', ->
    h1 = browser.query('h1').text
    h1.should.equal 'ColEdit'
  
  it 'has a log in', ->
    browser.query('body').text.should.include.string 'Log in'


feature 'Environment functionality', ->
  before (done) -> browser.visit '/subpage', done  
  
  it 'loads the url using baseUrl', ->
    $('h1').text.should.equal 'subpage'
  
  it 'extends the globals', ->
    pageTitle().should.equal 'WebSpecter Test Server'
    quack().should.equal 'quack quack'

feature 'Non-environment functionality', ->
  before (done) -> browser.visit 'http://localhost:4567', done

  it 'loads the url beginning with a protocol without using baseUrl', ->
    $('title').text.should.equal 'WebSpecter Test Server'

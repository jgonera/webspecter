feature 'Environment functionality', ->
  before (done) -> browser.visit '/', done  
  
  it 'extends the globals', ->
    pageTitle().should.equal 'WebSpecter Test Server'
    quack().should.equal 'quack quack'
  
  it "extends selectors", ->
    $(tea: 'black').text.should.equal 'black tea'

  it 'loads the url using baseUrl', (done) ->
    browser.visit '/subpage', ->
      $('h1').text.should.equal 'subpage'
      done()

feature 'Non-environment functionality', ->
  before (done) -> browser.visit 'http://localhost:4567', done

  it 'loads the url beginning with a protocol without using baseUrl', ->
    $('title').text.should.equal 'WebSpecter Test Server'

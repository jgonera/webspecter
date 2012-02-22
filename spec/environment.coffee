feature 'Environment functionality', (context, browser, $) ->
  before (done) -> browser.visit '/', done  
  
  it 'extends the context with helpers', ->
    context.pageTitle().should.equal 'WebSpecter Test Server'
    context.quack().should.equal 'quack quack'
    context.$.should.not.equal 'evil! context overwritten!'
  
  it "extends selectors", ->
    $(tea: 'black').text.should.equal 'black tea'

  it 'loads the url using baseUrl', (done) ->
    browser.visit '/subpage', ->
      $('h1').text.should.equal 'subpage'
      done()

feature 'Non-environment functionality', (context, browser, $) ->
  before (done) -> browser.visit 'http://localhost:4567', done

  it 'loads the url beginning with a protocol without using baseUrl', ->
    $('title').text.should.equal 'WebSpecter Test Server'

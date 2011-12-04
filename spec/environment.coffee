feature 'Environment functionality', url: '/subpage', ->
  it 'loads the url using baseUrl', ->
    $('p').text.should.equal 'Subpage'
  
  it 'extends the globals', ->
    pageTitle().should.equal 'WebSpecter Test Server'
    quack().should.equal 'quack quack'

feature 'Non-environment functionality', url: 'http://localhost:4567', ->
  it 'loads the url beginning with a protocol without using baseUrl', ->
    $('title').text.should.equal 'WebSpecter Test Server'

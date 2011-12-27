feature "Context", ->
  it "works", =>
    @browser.visit '/'
    @$('title').text.should.equal 'WebSpecter Test Server'

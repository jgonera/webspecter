feature "Context", ->
  before (done) => @browser.visit '/', done

  it "works", =>
    @$('title').text.should.equal 'WebSpecter Test Server'

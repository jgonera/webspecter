feature "Context", ->
  before (done) => @browser.visit '/', done

  it "is assigned by default to 'this'", =>
    @$('title').text.should.equal 'WebSpecter Test Server'

  describe "another context", =>
    other = @new()
    before (done) => other.browser.visit '/subpage', done

    it "can be dynamically created", =>
      other.$('h1').text.should.equal 'subpage'

    it "doesn't affect the default one", =>
      @$('h1').text.should.equal 'home'

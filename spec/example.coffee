feature 'Home page', 'http://localhost:3000', ->
  it 'has title', ->
    query('h1').text.should.equal 'ColEdit'
  
  it 'has a log in', ->
    query('body').text.should.include.string 'Log in'

feature 'Home page', 'http://localhost:3000', ->
  describe 'when Register clicked', ->
    before (done) ->
      query('#topbar a').click done
    
    it 'has a Register heading', ->
      query('#registration h1').text.should.include.string 'Register'


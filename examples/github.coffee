feature "GitHub search", (context, browser, $) ->
  before (done) -> browser.visit 'https://github.com/search', done

  it "finds WebSpecter", (done) ->
    $('input[name=q]').fill 'webspecter'
    $(button: 'Search').click ->
      $(link: "jgonera / webspecter").present.should.be.true
      done()

  it "looks only for users when asked to", (done) ->
    $('input[name=q]').fill 'webspecter'
    $(field: 'Search for').select 'Users'
    $(button: 'Search').click ->
      $(link: "jgonera / webspecter").present.should.be.false
      done()

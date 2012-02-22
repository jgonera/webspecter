feature 'Cookies', (context, browser, $) ->
  before (done) -> browser.visit '/', done
  
  it 'sets and reads a cookie', ->
    $('#setCookie').click()
    $('#getCookie').click()
    $('#info').text.should.equal 'bar'

feature 'Separate cookies per feature', dependsOn: ['Cookies'], (context, browser, $) ->
  before (done) -> browser.visit '/', done
  
  it "doesn't have a cookie from other feature", ->
    $('#getCookie').click()
    $('#info').text.should.not.equal 'bar'

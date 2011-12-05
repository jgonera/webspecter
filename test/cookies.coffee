feature 'Cookies', ->
  it 'sets and reads cookie', ->
    $('#setCookie').click()
    $('#getCookie').click()
    $('#info').text.should.equal 'bar'

feature 'Separate cookies per feature', dependsOn: ['Cookies'], ->
  it "doesn't have a cookie from other feature", ->
    $('#getCookie').click()
    $('#info').text.should.not.equal 'bar'

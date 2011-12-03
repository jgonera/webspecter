feature 'PageQuery', url: 'http://localhost:4567', ->
  describe '#text', ->
    it "returns element's text content", ->
      $('title').text.should.equal 'WebSpecter Test Server'
    
    it "returns an empty string if element doesn't exist", ->
      $('banana').text.should.be.empty
  
  describe '#click', ->
    it "it fires a mousedown event", ->
#      browser.page.evaluate ->
#        console.log document.querySelector('body').textContent
      $('#mousedown').click()
      $('#info').text.should.equal 'mousedown fired'
    
    it "it fires a mouseup event", ->
      $('#mouseup').click()
      $('#info').text.should.equal 'mouseup fired'
    
    it "it fires a click event", ->
      $('#click').click()
      $('#info').text.should.equal 'click fired'
  
    it 'sets cookie', ->
      $('#setCookie').click()
      $('#getCookie').click()
      $('#info').text.should.equal 'bar'
      #console.log $('#info').text

feature 'Cookie', url: 'http://localhost:4567', ->
  it "no cookie", ->
    $('#getCookie').click()
    $('#info').text.should.not.equal 'bar'
    #console.log $('#info').text

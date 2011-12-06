feature 'Queries', ->
  it "throws an error if no elements found", ->
    error = false
    try $('banana')
    catch e
      error = true
    finally error.should.equal true
  
  it "finds elements using xpath", ->
    $(xpath: '//*[text()="first item"]').text.should.equal 'first item'
  
  it "finds elements by their text content", ->
    $(text: 'first item').text.should.equal 'first item'
    
  it "finds fields by their label", ->
    $(field: 'info text:').value.should.equal 'initial value'
    $(field: 'info text').value.should.equal 'initial value'
    $(field: 'dummy field').value.should.equal 'dummy value'

  describe '#text', ->
    it "returns element's text content", ->
      $('title').text.should.equal 'WebSpecter Test Server'
  
  describe '#value', ->
    it "returns field's value", ->
      $('#infoText').value.should.equal 'initial value'
  
  describe '#attr', ->
    it "returns element's attribute", ->
      $('#link').attr('href').should.equal '/subpage'
  
  describe '#click', ->
    it "fires a mousedown event", ->
      $('#mousedown').click()
      $('#info').text.should.equal 'mousedown fired'
    
    it "fires a mouseup event", ->
      $('#mouseup').click()
      $('#info').text.should.equal 'mouseup fired'
    
    it "fires a click event", ->
      $('#click').click()
      $('#info').text.should.equal 'click fired'
    
    describe "when a link is clicked", ->
      before (done) -> $('#link').click(done)
      after (done) -> $('#home').click(done)
      it "follows it", ->
        $('p').text.should.equal 'subpage'
  
  describe '#fill', ->
    it "fills an input with text", ->
      $('input[name="infoText"]').fill 'input text'
      $(text: 'set info').click()
      $('#info').text.should.equal 'input text'
  
  describe "when there are more elements", ->
    it "lets us access them with an index", ->
      $('ol li')[0].text.should.include.string 'first'
      $('ol li')[1].text.should.include.string 'second'
      $('ol li')[2].text.should.include.string 'third'
    
    it "lets us iterate them with a for loop", ->
      element.text.should.include.string 'item' for element in $('ol li')
    
    it "lets us iterate them with #each", ->
      $('ol li').each (element) -> element.text.should.include.string 'item'
    
    it "lets us access the last element with #last", ->
      $('ol li').last.text.should.include.string 'third'

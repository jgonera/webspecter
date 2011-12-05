feature 'Queries', ->
  it "throws an error if no elements found", ->
    error = false
    try
      $('banana')
    catch e
      error = true
    finally
      error.should.equal true

  describe '#text', ->
    it "returns element's text content", ->
      $('title').text.should.equal 'WebSpecter Test Server'
  
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
      it "follows it", -> $('p').text.should.equal 'subpage'
  
  describe "when there are more elements", ->
    it "lets you access them with an index", ->
      $('ol li')[0].text.should.include.string 'first'
      $('ol li')[1].text.should.include.string 'second'
      $('ol li')[2].text.should.include.string 'third'
    
    it "lets you iterate them with a for loop", ->
      element.text.should.include.string 'item' for element in $('ol li')
    
    it "lets you iterate them with #each", ->
      $('ol li').each (element) -> element.text.should.include.string

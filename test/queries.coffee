feature 'Queries', ->
  before (done) -> browser.visit '/', done  
#  i = 1
#  afterEach -> browser.page.render "shots/#{i++} #{feature.currentTestFullTitle}.png"
  
  it "throws an error if no elements found and property is accessed", ->
    error = false
    try $('banana').text
    catch e
      error = true
    finally error.should.equal true
    error = false
    try $('cup').fill 'tea'
    catch e
      error = true
    finally error.should.equal true
  
  it "finds elements using xpath", ->
    $(xpath: '//*[text()="first item"]').text.should.equal 'first item'
  
  it "finds elements by their text content", ->
    $(text: 'first item').text.should.equal 'first item'
  
  it "finds links by their text", ->
    $(link: 'subpage').attr('href').should.equal '/subpage'
    
  it "finds fields by their label", ->
    $(field: 'info text:').value.should.equal 'initial value'
    $(field: 'info text').value.should.equal 'initial value'
    $(field: 'test input').value.should.equal 'test value'
  
  it "finds buttons by their caption", ->
    $(button: 'set info').attr('id').should.equal 'setInfo'
    $(button: 'submit test').attr('id').should.equal 'submitButton'
  
  describe '#exists', ->
    it "is true if element found", ->
      $('p').exists.should.equal true
    it "is false if element not found", ->
      $('banana').exists.should.equal false
  
  describe '#text', ->
    it "equals element's text content", ->
      $('title').text.should.equal 'WebSpecter Test Server'
  
  describe '#value', ->
    it "equals field's value", ->
      $('#infoText').value.should.equal 'initial value'

  describe '#checked', ->
    it "equals true if checkbox is checked", ->
      $('#checkedCheckbox').checked.should.equal true
    
    it "equals false if checkbox is unchecked", ->
      $('#uncheckedCheckbox').checked.should.equal false

  describe '#attr', ->
    it "returns element's attribute", ->
      $('#link').attr('href').should.equal '/subpage'
  
  describe '#fill', ->
    it "fills an input with text", ->
      $('input[name="infoText"]').fill 'input text'
      $(button: 'set info').click()
      $('#info').text.should.equal 'input text'
  
  describe '#check', ->
    it "checks the checkbox", ->
      $(field: 'unchecked checkbox').check()
      $(field: 'unchecked checkbox').checked.should.equal true
  
  describe '#uncheck', ->
    it "unchecks the checkbox", ->
      $(field: 'checked checkbox').uncheck()
      $(field: 'checked checkbox').checked.should.equal false
  
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
      before (done) -> $(link: 'subpage').click(done)
      after (done) -> $(link: 'home').click(done)
      
      it "follows it", ->
        browser.url.should.equal 'http://localhost:4567/subpage'
        $('h1').text.should.equal 'subpage'
    
    describe "when a submit button is clicked", ->
      before (done) -> $(button: 'submit test').click(done)
      after (done) -> $(link: 'home').click(done)
      
      it "submits the form", ->
        $('p')[0].text.should.equal 'input: test value'
  
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
  

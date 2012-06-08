feature 'Queries', (context, browser, $) ->
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

  describe '#present', ->
    it "is true if element found", ->
      $('p').present.should.equal true
      
    it "is false if element not found", ->
      $('banana').present.should.equal false
    
    it "has an is# function equivalent", ->
      $('p').is.present().should.equal true
      $('banana').is.present().should.equal false
  
  describe '#visible', ->
    beforeEach -> $(button: 'reset visibility').click()
    
    it "is true when display is not none and visibility is not hidden", ->
      $('#box').visible.should.equal true
    
    it "is false if display is none", ->
      $(button: 'display: none').click()
      $('#box').visible.should.equal false
    
    it "is false if visibility is hidden", ->
      $(button: 'visibility: hidden').click()
      $('#box').visible.should.equal false
    
    it "is false when parent is not visible", ->
      $(button: 'parent display: none').click()
      $('#box').visible.should.equal false
    
    it "has an is# function equivalent", ->
      $('#box').is.visible().should.equal true
  
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
      
    it "has an is# function equivalent", ->
      $('#checkedCheckbox').is.checked().should.equal true

  describe '#attr', ->
    it "returns element's attribute", ->
      $('#link').attr('href').should.equal '/subpage'

  describe '#style', ->
    it "returns element's CSS style", ->
      $('#styledAttribute').style('color').should.equal 'rgb(0, 128, 0)'
      $('#styledAttribute').style('background-color').should.equal 'transparent'

    it "returns element's CSS style from a stylesheet", ->
      $('#styledStylesheet').style('color').should.equal 'rgb(128, 0, 128)'
  
  describe '#fill', ->
    it "fills an input/textarea with text", ->
      $('input[name="infoText"]').fill 'input text'
      $(button: 'set info').click()
      $('#info').text.should.equal 'input text'

  describe '#type', ->
    it "types the text in input/textarea without deleting existing text", ->
      $(field: "info text").type ' and something'
      $(field: "info text").value.should.equal 'input text and something'
  
  describe '#check', ->
    it "checks the checkbox", ->
      $(field: 'unchecked checkbox').check()
      $(field: 'unchecked checkbox').checked.should.equal true
  
  describe '#uncheck', ->
    it "unchecks the checkbox", ->
      $(field: 'checked checkbox').uncheck()
      $(field: 'checked checkbox').checked.should.equal false

  describe "#select", ->
    it "selects an option", ->
      $(field: 'select').select('Two')
      $(field: 'select').value.should.equal '2'

  describe "when there are more elements", ->
    it "lets us access them with an index", ->
      $('ol li')[0].text.should.include 'first'
      $('ol li')[1].text.should.include 'second'
      $('ol li')[2].text.should.include 'third'
    
    it "lets us iterate them with a for loop", ->
      element.text.should.include 'item' for element in $('ol li')
    
    it "lets us iterate them with #each", ->
      $('ol li').each (element) -> element.text.should.include 'item'
    
    it "lets us access the last element with #last", ->
      $('ol li').last.text.should.include 'third'
  

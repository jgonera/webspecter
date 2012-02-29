feature 'Wait', (context, browser, $) ->
  before (done) -> browser.visit '/', done
  
  it "waits until an element is present", (done) ->
    $('#delayAddButton').click()
    wait.until $('#delayed').is.present, ->
      $('#delayed').present.should.equal true
      done()
  
  it "waits while an element is present", (done) ->
    $('#delayRemoveButton').click()
    wait.while context.delayedPresent, ->
      $('#delayed').present.should.equal false
      done()

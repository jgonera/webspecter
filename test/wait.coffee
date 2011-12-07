feature 'Wait', ->
  describe "#untilExists", ->
    before (done) ->
      $('#delayAddButton').click()
      wait.untilExists '#delayed', done
      
    it "waits until the element exists", ->
      $('#delayed').exists.should.equal true
  
  describe "#whileExists", ->
    before (done) ->
      $('#delayRemoveButton').click()
      wait.whileExists '#delayed', done
      
    it "waits until the element disappears", ->
      $('#delayed').exists.should.equal false

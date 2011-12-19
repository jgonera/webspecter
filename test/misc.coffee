feature "Miscellaneous", ->
  describe "feature#currentTest", ->
    it "is the current test", ->
      feature.currentTest.title.should.equal "is the current test"

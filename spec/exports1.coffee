exports.helpers =
  sayHi: -> 'hi'

feature "Exports1", ->
  @include './exports2'

  it "uses something from its own exports", =>
    @sayHi().should.equal 'hi'

  it "uses something from Exports2", =>
    @soup.should.equal 'tomato'

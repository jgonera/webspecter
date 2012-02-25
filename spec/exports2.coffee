exports.helpers =
  soup: 'tomato'

feature "Exports2", ->
  @include './exports1'

  it "uses something from Exports1", =>
    @sayHi().should.equal 'hi'

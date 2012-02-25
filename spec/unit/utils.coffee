utils = require '../../utils'

describe 'utils', ->
  describe '#injectArgs', ->
    it 'injects primitive types', ->
      fn = utils.injectArgs { aString: 'abc', aNumber: 23, aBool: true }, ->
        return [$aString, $aNumber, $aBool]
      
      fn().should.eql ['abc', 23, true]
    
    it 'injects objects', ->
      fn = utils.injectArgs { obj: { 1: 2, foo: 'bar' }, arr: [3, 4, 'baz'] }, ->
        return [$obj, $arr]
      
      fn().should.eql [ { 1: 2, foo: 'bar' }, [3, 4, 'baz'] ]
    
    it 'injects functions', ->
      fn = utils.injectArgs { func: (name) -> 'hello ' + name }, ->
        return $func('world')
      
      fn().should.equal 'hello world'
    
    it "maintains function's normal arguments", ->
      fn = utils.injectArgs { name: 'world' }, (greeting, times) ->
        return (greeting + ' ' + $name for i in [0...times]).join(', ')
      
      fn('hello', 2).should.equal 'hello world, hello world'
  
  describe '#extend', ->
    it 'extends object with source', ->
      object = { banana: 4, cake: 2 }
      source = { donuts: 3, pizza: 1 }
      utils.extend object, source
      object.should.eql { banana: 4, cake: 2, donuts: 3, pizza: 1 }
    
    it "doesn't replace object's properties with source's properties", ->
      object = { banana: 4, cake: 2 }
      source = { banana: 2, pizza: 1 }
      utils.extend object, source
      object.should.eql { banana: 4, cake: 2, pizza: 1 }
      

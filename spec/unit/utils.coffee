utils = require '../../lib/utils'

describe 'utils', ->
  describe '#injectArgs', ->
    it 'injects primitive types', ->
      fn = utils.injectArgs 'abc', 23, true, (aString, aNumber, aBool) ->
        return [aString, aNumber, aBool]
      
      fn().should.eql ['abc', 23, true]
    
    it 'injects objects', ->
      fn = utils.injectArgs { 1: 2, foo: 'bar' }, [3, 4, 'baz'], (obj, arr) ->
        return [obj, arr]
      
      fn().should.eql [ { 1: 2, foo: 'bar' }, [3, 4, 'baz'] ]
    
    it 'injects functions', ->
      fn = utils.injectArgs ((name) -> 'hello ' + name), (func) ->
        return func('world')
      
      fn().should.equal 'hello world'
    
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
      

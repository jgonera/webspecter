describe "background", ->
  order = []
  
  describe "suite A", ->
    background -> order.push 'A'

    describe "suite B1", ->
      background -> order.push 'B1'
      
      it "test", -> order.should.eql ['A']
      
      describe "suite C", ->
        it "test", -> order.should.eql ['A', 'B1']

    describe "suite B2", ->
      it "test", -> order.should.eql ['A', 'B1', 'A']


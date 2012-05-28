wait = require '../../keywords/wait'

describe 'wait', ->
  describe '#until', ->
    it "runs the second function when the first function returns true", ->
      run = false
      wait.until (-> true), -> run = true
      run.should.equal true
    
    it "runs the second function only once", (done) ->
      runs = 0
      wait.until (-> true), -> runs += 1
      setTimeout (->
        try
          runs.should.equal 1
          done()
        catch e
          done(e)
      ), 100
    
    it "waits until the first function returns true", (done) ->
      run = false
      condition = false
      setTimeout (-> condition = true), 50
      wait.until (-> condition), -> run = true
      run.should.equal false
      setTimeout (->
        try
          run.should.equal true
          done()
        catch e
          done(e)
      ), 100
  
  describe '#while', ->
    it "runs the second function when the first function returns false", ->
      run = false
      wait.while (-> false), -> run = true
      run.should.equal true
    
    it "runs the second function only once", (done) ->
      runs = 0
      wait.while (-> false), -> runs += 1
      setTimeout (->
        try
          runs.should.equal 1
          done()
        catch e
          done(e)
      ), 100
    
    it "waits until the first function returns false", (done) ->
      run = false
      condition = true
      setTimeout (-> condition = false), 50
      wait.while (-> condition), -> run = true
      run.should.equal false
      setTimeout (->
        try
          run.should.equal true
          done()
        catch e
          done(e)
      ), 100
      

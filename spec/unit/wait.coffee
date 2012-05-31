wait = require '../../keywords/wait'

interceptException = (callback) ->
  oldListeners = process.listeners 'uncaughtException'
  process.removeAllListeners()
  process.on 'uncaughtException', (e) ->
    process.removeAllListeners()
    process.on 'uncaughtException', fn for fn in oldListeners
    callback(e)


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
        runs.should.equal 1
        done()
      ), 100
    
    it "waits until the first function returns true", (done) ->
      run = false
      condition = false
      setTimeout (-> condition = true), 50
      wait.until (-> condition), -> run = true
      run.should.equal false
      setTimeout (->
        run.should.equal true
        done()
      ), 100

    it "throws an error after a specified timeout", (done) ->
      run = false
      tooEarly = true
      wait.until (-> false), for: 50, -> run = true
      setTimeout (->
        tooEarly = false
      ), 30
      interceptException (e) ->
        tooEarly.should.equal false
        run.should.equal false
        e.message.should.match(/^Timeout waiting until/)
        done()

    it "allows a timeout message to be attached to the function", (done) ->
      fn = -> false
      fn.message = "Waiting no more"
      wait.until fn, for: 1, -> shouldNotRun()
      interceptException (e) ->
        e.message.should.include "Waiting no more"
        done()

    it "allows a timeout message to be passed as an argument ", (done) ->
      wait.until (-> false), for: 1, message: "test marker", -> shouldNotRun()
      interceptException (e) ->
        e.message.should.include "test marker"
        done()

  describe '#while', ->
    it "runs the second function when the first function returns false", ->
      run = false
      wait.while (-> false), -> run = true
      run.should.equal true
      

feature "Parallelize", ->
  parallel = null
  beforeEach ->
    parallel = parallelize 2

  it "works", (done) =>
    called = false
    setTimeout parallel, 50
    setTimeout parallel, 20
    parallel.done => called = true
    called.should.equal false
    setTimeout (=>
      called.should.equal true
      done()
    ), 100

  it "works immediately", (done) =>
    parallel()
    parallel()
    parallel.done done

  it "doesn't call the callback if not run enough times", (done) =>
    called = false
    parallel()
    parallel.done => called = true
    setTimeout (=>
      called.should.equal false
      done()
    ), 50

  it "resets after calling the callback", =>
    called = false
    parallel()
    parallel()
    parallel.done (=>)
    parallel()
    parallel.done => called = true
    called.should.equal false
    parallel()
    called.should.equal true

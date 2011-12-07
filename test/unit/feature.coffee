{EventEmitter} = require('events')
{Feature, FeatureManager} = require('../../feature')

class DummySuite extends EventEmitter
  constructor: ->
    @addSuiteCalls = []
    
  beforeAll: (fn) ->
    fn => @emit 'beforeAll done'
  
  addSuite: (suite) ->
    @addSuiteCalls.push suite
    @emit 'addSuite'

class DummyFeature extends EventEmitter
  constructor: (options = {}) ->
    @delay = options.delay or 0
    @dependencies = options.dependencies or []
    @title = options.title or 'f' + Math.random()
    @loadCalls = []
    @loadPageCalls = []
  
  load: (rootSuite) ->
    @loadCalls.push rootSuite
    @emit 'load'
  
  loadPage: ->
    @loadPageCalls.push null
    setTimeout (=> @emit 'pageLoaded'), @delay
    

describe 'Feature', ->
  rootSuite = null
  suite = null
  feature = null
  fnRun = false
  
  beforeEach ->
    fnRun = false
    rootSuite = new DummySuite
    suite = new DummySuite
    feature = new Feature(suite, url: 'http://localhost:4567', -> fnRun = true)
  
  describe '#load', ->
    it "addes the features suite to the rootSuite", ->
      feature.load(rootSuite)
      rootSuite.addSuiteCalls.length.should.equal 1
      rootSuite.addSuiteCalls[0].should.equal suite
    
    it "makes the suite emit pre-require", ->
      emitted = false
      suite.on 'pre-require', -> emitted = true
      feature.load(rootSuite)
      emitted.should.equal true
    
    it "adds a beforeAll block", (done) ->
      suite.on 'beforeAll done', done
      feature.loadPage()
      feature.load(rootSuite)
      global.browser.should.equal feature.browser
      global.$.should.be.an.instanceOf Function
      global.wait.should.equal feature.wait
      
    it "runs the feature description function", ->
      feature.load(rootSuite)
      fnRun.should.be.ok
    
    it "makes the suite emit post-require", ->
      emitted = false
      suite.on 'post-require', -> emitted = true
      feature.load(rootSuite)
      emitted.should.equal true
  
  describe '#loadPage', ->
    it 'loads the page', ->
      feature.loadPage()
      feature.browser.url.should.equal 'http://localhost:4567'
    
    it 'emits pageLoaded', (done) ->
      feature.on 'pageLoaded', done
      feature.loadPage()
      

describe 'FeatureManager', ->
  rootSuite = null
  featureManager = null
  
  beforeEach ->
    rootSuite = new DummySuite
    featureManager = new FeatureManager(rootSuite)
  
  describe '#addFeature', ->
    it 'adds a feature to the FeatureManager', ->
      feature = new DummyFeature(title: 'feature')
      featureManager.addFeature feature
      featureManager.length.should.equal 1
      featureManager.features['feature'].should.equal feature
    
    it 'throws an error when adding features with the same title', ->
      error = false
      try
        featureManager.addFeature(new DummyFeature(title: 'feature'))
        featureManager.addFeature(new DummyFeature(title: 'feature'))
      catch e
        error = true
      finally
        error.should.equal true
  
  describe '#loadFeatures', ->
    it 'chains #loadPage of all the features', (done) ->
      feature1 = new DummyFeature(title: 'f1', delay: 10)
      feature2 = new DummyFeature(dependencies: ['f1'])
      featureManager.addFeature feature1
      featureManager.addFeature feature2
      featureManager.loadFeatures()
      feature1.loadPageCalls.length.should.equal 1
      feature2.loadPageCalls.length.should.equal 0
      feature1.on 'pageLoaded', ->
        try
          feature2.loadPageCalls.length.should.equal 1
          done()
        catch e
          done(e)
    
    it "doesn't throw an exception when there are no features", ->
      featureManager.loadFeatures()
    
    it "loads all the features", =>
      feature1 = new DummyFeature
      feature2 = new DummyFeature
      featureManager.addFeature feature1
      featureManager.addFeature feature2
      featureManager.loadFeatures()
      feature1.loadCalls.length.should.equal 1
      feature1.loadCalls[0].should.equal rootSuite
      feature2.loadCalls.length.should.equal 1
      feature2.loadCalls[0].should.equal rootSuite
    
    it "loads the features in order taking into account their dependencies", ->
      featureOrder = []
      features = [
        new DummyFeature(title: 'f1', dependencies: ['f2', 'f4'])
        new DummyFeature(title: 'f2', dependencies: ['f3', 'f4'])
        new DummyFeature(title: 'f3')
        new DummyFeature(title: 'f4', dependencies: ['f3'])
      ]
      for feature in features
        do (feature) ->
          feature.on 'load', -> featureOrder.push feature.title
          featureManager.addFeature feature
      featureManager.loadFeatures()
      featureOrder.should.eql ['f3', 'f4', 'f2', 'f1']
    
    it "throws an error on circular dependencies", ->
      error = false
      featureManager.addFeature new DummyFeature(title: 'f1', dependencies: ['f2'])
      featureManager.addFeature new DummyFeature(title: 'f2', dependencies: ['f3'])
      featureManager.addFeature new DummyFeature(title: 'f3', dependencies: ['f1'])
      try
        featureManager.loadFeatures()
      catch e
        error = true
      finally
        error.should.equal true
      
      

{EventEmitter} = require('events')
{Feature, FeatureManager} = require('../feature')

class DummySuite extends EventEmitter
  beforeAll: ->

class DummyFeature extends EventEmitter
  constructor: (@delay = 0) ->
    @loadCalls = 0
    @loadPageCalls = 0
  
  load: ->
    @loadCalls += 1
  
  loadPage: ->
    @loadPageCalls += 1
    self = this
    setTimeout (-> self.emit 'pageLoaded'), @delay
    

describe 'Feature', ->
  suite = null
  feature = null
  fnRun = false
  
  beforeEach ->
    suite = new DummySuite
    feature = new Feature suite, url: 'http://localhost:4567', -> fnRun = true
  
  describe '#load', ->
    it "makes the suite emit pre-require", ->
      emitted = false
      suite.on 'pre-require', -> emitted = true
      feature.load()
      emitted.should.be.ok
    
    it "adds a beforeAll block"
      
    it "runs the feature description function", ->
      feature.load()
      fnRun.should.be.ok
    
    it "makes the suite emit post-require", ->
      emitted = false
      suite.on 'post-require', -> emitted = true
      feature.load()
      emitted.should.be.ok
  
  describe '#loadPage', ->
    it 'loads the page', ->
      feature.loadPage()
      feature.browser.url.should.equal 'http://localhost:4567'
    
    it 'emits pageLoaded', (done) ->
      emitted = false
      feature.on 'pageLoaded', -> emitted = true
      feature.loadPage()
      setTimeout (->
        try
          emitted.should.be.ok
          done()
        catch e
          done(e)
      ), 50
      

describe 'FeatureManager', ->
  featureManager = null  
  beforeEach -> featureManager = new FeatureManager
  
  describe '#addFeature', ->
    it 'adds a feature to the FeatureManager', ->
      featureManager.addFeature 'fake'
      featureManager.features.length.should.equal 1
      featureManager.features[0].should.equal 'fake'
  
  describe '#loadFeatures', ->
    it 'calls #loadPage for all the features', (done) ->
      feature1 = new DummyFeature
      feature2 = new DummyFeature
      featureManager.addFeature feature1
      featureManager.addFeature feature2
      featureManager.loadFeatures()
      setTimeout (->
        try
          feature1.loadPageCalls.should.equal 1
          feature2.loadPageCalls.should.equal 1
          done()
        catch e
          done(e)
      ), 10
    
    it 'chains #loadPage of the next feature when the previous finishes', (done) ->
      feature1 = new DummyFeature(50)
      feature2 = new DummyFeature
      featureManager.addFeature feature1
      featureManager.addFeature feature2
      featureManager.loadFeatures()
      feature1.loadPageCalls.should.equal 1
      feature2.loadPageCalls.should.equal 0
      setTimeout (->
        try
          feature2.loadPageCalls.should.equal 1
          done()
        catch e
          done(e)
      ), 100
    
    it "doesn't throw an exception where there are no features", ->
      featureManager.loadFeatures()
    
    it "loads all the features", =>
      feature1 = new DummyFeature
      feature2 = new DummyFeature
      featureManager.addFeature feature1
      featureManager.addFeature feature2
      featureManager.loadFeatures()
      feature1.loadCalls.should.equal 1
      feature2.loadCalls.should.equal 1
      

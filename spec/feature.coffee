{EventEmitter} = require('events')
{Feature, FeatureManager} = require('../feature')
Browser = require('../Browser')

class DummySuite extends EventEmitter
  constructor: ->
    @done = false
    
  beforeAll: (fn) ->
    fn => @done = true

class DummyFeature extends EventEmitter
  constructor: (options = {}) ->
    @delay = options.delay or 0
    @dependencies = options.dependencies or []
    @title = options.title or 'f' + Math.random()
    @loadCalls = 0
    @loadPageCalls = 0
  
  load: ->
    @loadCalls += 1
    @emit 'loaded'
  
  loadPage: ->
    @loadPageCalls += 1
    setTimeout (=> @emit 'pageLoaded'), @delay
    

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
      emitted.should.equal true
    
    it "adds a beforeAll block", (done) ->
      feature.loadPage()
      feature.load()
      global.browser.should.be.an.instanceOf Browser
      global.$.should.be.an.instanceOf Function
      setTimeout (->
        try
          suite.done.should.equal true
          done()
        catch e
          done(e)
      ), 50
      
    it "runs the feature description function", ->
      feature.load()
      fnRun.should.be.ok
    
    it "makes the suite emit post-require", ->
      emitted = false
      suite.on 'post-require', -> emitted = true
      feature.load()
      emitted.should.equal true
  
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
      feature1 = new DummyFeature(title: 'f1', delay: 50)
      feature2 = new DummyFeature(dependencies: ['f1'])
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
    
    it "doesn't throw an exception when there are no features", ->
      featureManager.loadFeatures()
    
    it "loads all the features", =>
      feature1 = new DummyFeature
      feature2 = new DummyFeature
      featureManager.addFeature feature1
      featureManager.addFeature feature2
      featureManager.loadFeatures()
      feature1.loadCalls.should.equal 1
      feature2.loadCalls.should.equal 1
    
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
          feature.on 'loaded', -> featureOrder.push feature.title
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
      
      

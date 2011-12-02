EventEmitter = require('events').EventEmitter
FeatureManager = require('../feature').FeatureManager

class DummyFeature extends EventEmitter
  constructor: (@delay = 0) ->
    @calls = 0
  
  loadPage: ->
    @calls += 1
    self = this
    setTimeout (-> self.emit 'pageLoaded'), @delay
    

describe 'FeatureManager', ->
  featureManager = null  
  
  beforeEach ->
    featureManager = new FeatureManager
  
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
          feature1.calls.should.equal 1
          feature2.calls.should.equal 1
          done()
        catch e
          done(e)
      ), 10
    
    it 'calls #loadPage of the next feature when the previous finishes', (done) ->
      feature1 = new DummyFeature(50)
      feature2 = new DummyFeature
      featureManager.addFeature feature1
      featureManager.addFeature feature2
      featureManager.loadFeatures()
      feature1.calls.should.equal 1
      feature2.calls.should.equal 0
      setTimeout (->
        try
          feature2.calls.should.equal 1
          done()
        catch e
          done(e)
      ), 100
      

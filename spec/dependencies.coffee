dependencyRun = false
dependentRun = false

feature 'Super dependent'
  url: 'http://localhost:4567'
  dependsOn: ['Dependent']
  ->
    it 'depends on Dependent', ->
      dependentRun.should.equal true


feature 'Dependent', url: 'http://localhost:4567', dependsOn: ['Dependency'], ->
  it 'depends on Dependency', ->
    dependencyRun.should.equal true
  
  it 'runs', ->
    dependentRun = true

feature 'Dependency', url: 'http://localhost:4567', ->
  it 'runs', ->
    dependencyRun = true

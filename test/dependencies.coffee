dependencyRun = false
dependentRun = false

feature 'Super dependent', dependsOn: ['Dependent'], ->
  it 'depends on Dependent', ->
    dependentRun.should.equal true

feature 'Dependent', dependsOn: ['Dependency'], ->
  it 'depends on Dependency', ->
    dependencyRun.should.equal true
  
  it 'runs', ->
    dependentRun = true

feature 'Dependency', ->
  it 'runs', ->
    dependencyRun = true
    

dependencyRun = false
dependentRun = false

feature 'Super dependent', dependsOn: ['Dependent'], (context, browser, $) ->
  it 'depends on Dependent', ->
    dependentRun.should.equal true

feature 'Dependent', dependsOn: ['Dependency'], (context, browser, $) ->
  it 'depends on Dependency', ->
    dependencyRun.should.equal true
  
  it 'runs', ->
    dependentRun = true

feature 'Dependency', (context, browser, $) ->
  it 'runs', ->
    dependencyRun = true
    

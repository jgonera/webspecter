// Simple tests for experiments and checking if tests in JavaScript work

describe('Simple JavaScript test', function() {
  it('passes correct examples', function() {
    //bang;
    should.exist('hello');
    'hello'.should.equal('hello');
  });
  
  it('catches exceptions', function() {
    try {
      [1,2].should.have.length(4);
    } catch (e) {
      e.name.should.equal('AssertionError');
    }
  });
});

//describe('Failing test', function() {
//  it('fails', function() {
//    [1,2].should.have.length(4);
//  });
//});

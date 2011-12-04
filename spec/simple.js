// Simple tests, checking if mocha, should.js and tests in JavaScript work

describe('Simple JavaScript test', function() {
  it('passes correct examples', function() {
    //bang;
    'hello'.should.equal('hello');
  });
  
  it('catches exceptions', function() {
    try {
      [1,2].should.have.lengthOf(4);
    } catch (e) {
      e.name.should.equal('AssertionError');
    }
  });
  
  it('works async', function(done) {
    var pass = false;
    setTimeout(function() {
      pass = true;
      pass.should.be.ok;
      done();
    }, 10);
    pass.should.not.be.ok;
  });
});

//describe('Failing test', function() {
//  it('fails', function() {
//    [1,2].should.have.length(4);
//  });
//});

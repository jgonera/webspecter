var mocha = require('mocha');
var Suite = mocha.Suite
  , Test = mocha.Test;

/**
 * BDD-style interface:
 * 
 *      describe('Array', function(){
 *        describe('#indexOf()', function(){
 *          it('should return -1 when not present', function(){
 *
 *          });
 *
 *          it('should return the index when present', function(){
 *
 *          });
 *        });
 *      });
 * 
 */

module.exports = function(suite){
  var suites = [suite];
  var backgrounds = [ [] ];

  suite.on('pre-require', function(context){

    /**
     * Execute before running tests.
     */

    context.before = function(fn){
      suites[0].beforeAll(fn);
    };

    /**
     * Execute after running tests.
     */

    context.after = function(fn){
      suites[0].afterAll(fn);
    };

    /**
     * Execute before each test case.
     */

    context.beforeEach = function(fn){
      suites[0].beforeEach(fn);
    };

    /**
     * Execute after each test case.
     */

    context.afterEach = function(fn){
      suites[0].afterEach(fn);
    };
    
    /**
     * Execute before each child suite.
     */

    context.background = function(fn){
      backgrounds[0].push(fn);
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */
  
    context.describe = function(title, fn){
      var suite = Suite.create(suites[0], title);
      
      backgrounds[0].forEach(function(fn_) {
        suite.beforeAll(fn_);
      });
      backgrounds.unshift([]);
      
      suites.unshift(suite);
      fn();
      suites.shift();
      
      backgrounds.shift();
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.it = function(title, fn){
      suites[0].addTest(new Test(title, fn));
    };
  });
};

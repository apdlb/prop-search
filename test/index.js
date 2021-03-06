describe("prop-search", function () {
  var ps = require('../index');
  assert = require('assert');

  var testObj = {
    propA: 'something',
    propB: 'something2',
    propC: { index: true },

    propD: {
      something: true,
      someOther: {
        index: true
      },
      somethingElse: 'somethingElse',
      more: {
        stuff: 'here',
        things: {
          nested: false,
          something: true
        }
      }
    },

    propF: {
      objA: 'Budha',
      someOther: {
        cover: 'something',
        foo: {index: true},
        bar: false,
        something: true
      },
      objC: ['index', 'blah'],
      moreNester: {
        meant: 'tre',
        asdf: {
          someval: true,
          val1: 'good'
        }
      }
    },

    propG: {
      objB: {
        someNumValue: 5
      }
    }

  };

  var testObj2 = {
    something: {
      something: {
        something: {
          something: {
            something: true
          }
        }
      }
    }
  };

  var testObj3 = {
    something: {
      otherthing: {
        something: [
          {
            something: true
          },
          {
            other: false
          }
        ]
      }
    }
  };

  var arrayTest = {
    someArrayProp: [
      {
        rootPropA: {
          propA: 'someValue',
          propB: 10
        },
        rootPropB: 'dummy'
      },
      {
        rootPropC: {
          propC: true,
          prodD: 'something'
        },
        rootPropF: 23
      },
      {

        rootPropG: {
          propA: 'anotherValue',
          propF: false
        },
        rootPropH: 'yo'
      }
    ],
    someOtherProp: 'something yo'
  };


  describe("searchForBoolean", function () {
    it("should find boolean values when just given the property name", function () {
      var res = ps.searchForBoolean(testObj, 'index');

      var expected = [
        { path: [ 'propC' ], value: { index: true }, key: 'propC' },
        { path: [ 'propD', 'someOther' ],
          value: { index: true },
          key: 'someOther' },
        { path: [ 'propF', 'someOther', 'foo' ],
          value: { index: true },
          key: 'foo' }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work on nested object with all the same named properties', function () {
      var res = ps.searchForBoolean(testObj2, 'something');
      var expected = [
        { path: [ 'something', 'something', 'something', 'something' ],
          value: { something: true },
          key: 'something' }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with options set', function () {
      var res = ps.searchForBoolean(testObj, 'someval', {separator: '.'});

      var expected = [
        { path: 'propF.moreNester.asdf',
          value: { someval: true, val1: 'good' },
          key: 'asdf' }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with no options set but val set', function () {
      var res = ps.searchForBoolean(testObj, 'nested', false);

      var expected = [
        { path: [ 'propD', 'more', 'things' ],
          value: { nested: false, something: true },
          key: 'things' }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with all options set', function () {
      var res = ps.searchForBoolean(testObj, 'nested', {separator: '.'}, false);

      var expected = [
        { path: 'propD.more.things',
          value: { nested: false, something: true },
          key: 'things' }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with arrays', function () {
      var res = ps.searchForBoolean(testObj3, 'something');

      var expected = [
        {
          path: [ 'something', 'otherthing', 'something', 0 ],
          value: [
            { something: true },
            { other: false }
          ],
          key: 'something'
        }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with function as properties', function () {
      var testObj = {
        propA: { type: String },
        propB: String,
        propC: {type: Object, ref: 'Blah'},
        propD: {type: String, index: true}
      };

      var actual = ps.searchForBoolean(testObj, 'index', {separator: '.'});

      var expected = [
        { path: 'propD',
          value: { type: Object, index: true},
          key: 'propD' }
      ];

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.equal(actual[0].value.index, expected[0].value.index, 'incorrect results.');
      assert.equal(actual[0].key, expected[0].key, 'incorrect results.');
    });

    it('should work with arrays 2', function () {
      var res = ps.searchForBoolean(arrayTest, 'propC');

      var expected = [
        {
          path: [ 'someArrayProp', 1, 'rootPropC' ],
          value: {
            propC: true,
            prodD: 'something'
          },
          key: 'rootPropC'
        }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });
  });

  describe("searchForExistence", function () {
    it('should work with no options set', function () {
      var actual = ps.searchForExistence(testObj, 'someval');

      var expected = [
        { path: [ 'propF', 'moreNester', 'asdf' ],
          value: { someval: true, val1: 'good' },
          key: 'asdf' }
      ];

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work on nested object with all the same named properties', function () {
      var actual = ps.searchForExistence(testObj2, 'something');

      var expected = [
        { path: [], value: { something: {
          something: {
            something: {
              something: {
                something: true
              }
            }
          }
        } }, key: undefined },
        { path: [ 'something' ],
          value: { something: {
            something: {
              something: {
                something: true
              }
            }
          } },
          key: 'something' },
        { path: [ 'something', 'something' ],
          value: { something: {
            something: {
              something: true
            }
          } },
          key: 'something' },
        { path: [ 'something', 'something', 'something' ],
          value: { something: {
            something: true
          } },
          key: 'something' },
        { path: [ 'something', 'something', 'something', 'something' ],
          value: { something: true },
          key: 'something' }
      ];

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with separator option set', function () {
      var actual = ps.searchForExistence(testObj, 'someval', {separator: '.'});

      var expected = [
        { path: 'propF.moreNester.asdf',
          value: { someval: true, val1: 'good' },
          key: 'asdf' }
      ];

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with function as properties', function () {
      var testObj = {
        propA: { type: String },
        propB: String,
        propC: {type: Object, ref: 'Blah'}
      };

      var actual = ps.searchForExistence(testObj, 'ref', {separator: '.'});

      var expected = [
        { path: 'propC',
          value: { type: Object, ref: 'Blah'},
          key: 'propC' }
      ];

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with arrays', function () {
      var res = ps.searchForExistence(testObj3, 'other');

      var expected = [
        { path: [ 'something', 'otherthing', 'something', 1 ],
          value: [
            { something: true },
            { other: false }
          ],
          key: 'something'
        }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with arrays 2', function () {
      var testObj6 = {
        onething: {
          twothing: {
            arraything: [
              {
                something: true
              },
              {
                other: false
              }
            ]
          }
        }
      };

      var expected = [
        { path: [ 'onething', 'twothing', 'arraything', 0 ],
          value: [
            { something: true },
            { other: false }
          ],
          key: 'arraything'
        }
      ];

      var actual = ps.searchForExistence(testObj6, 'something');

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with arrays 3', function () {
      var res = ps.searchForExistence(arrayTest, 'propA', {separator: '.'});

      var expected = [
        {
          path: 'someArrayProp.0.rootPropA',
          value: {
            propA: 'someValue',
            propB: 10
          },
          key: 'rootPropA'
        },
        {
          path: 'someArrayProp.2.rootPropG',
          value: {
            propA: 'anotherValue',
            propF: false
          },
          key: 'rootPropG'
        }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });
  });

  describe("searchForValue", function () {
    it('should work with no option set', function () {
      var expected = [
        { path: [ 'propF', 'moreNester', 'meant' ],
          value: 'tre',
          key: 'meant' }
      ];

      var actual = ps.searchForValue(testObj, 'tre');

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with no option set with a number', function () {
      var expected = [
        { path: [ 'propG', 'objB', 'someNumValue' ],
          value: 5,
          key: 'someNumValue'
        }
      ];

      var actual = ps.searchForValue(testObj, 5);

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with separator option set', function () {
      var expected = [
        { path: 'propD.more.stuff',
          value: 'here',
          key: 'stuff' }
      ];

      var actual = ps.searchForValue(testObj, 'here', {separator: '.' });

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with arrays and text', function () {
      var testObj4 = {
        something: {
          other: {
            something: [ 'val1', 'val2', 'val3' ]
          }
        }
      };


      var res = ps.searchForValue(testObj4, 'val2');

      var expected = [
        { path: [ 'something', 'other', 'something', 1 ],
          value: [ 'val1', 'val2', 'val3' ],
          key: 'something'
        }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with arrays and number', function () {
      var testObj5 = {
        something: {
          other: {
            something: [ 'val1', 11, 'val3' ]
          }
        }
      };

      var res = ps.searchForValue(testObj5, 11);

      var expected = [
        { path: [ 'something', 'other', 'something', 1 ],
          value: [ 'val1', 11, 'val3' ],
          key: 'something'
        }
      ];

      assert.equal(res.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(res, expected, 'incorrect results');
    });

    it('should work with function as properties', function () {
      var testObj = {
        propA: { type: String },
        propB: String,
        propC: {type: Object, ref: 'Blah'},
        propD: {type: String, index: true}
      };

      var actual = ps.searchForValue(testObj, 'Blah', {separator: '.'});

      var expected = [
        { path: 'propC.ref',
          value: 'Blah',
          key: 'ref' }
      ];

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });
  });

  describe("search", function () {
    it('should work with no option set', function () {

      var expected = [
        { path: ['propF', 'moreNester', 'asdf'],
          value: { someval: true,
            val1: 'good' },
          key: 'asdf' }
      ];

      var test = function (obj) {
        return obj.val1 === 'good';
      };

      var actual = ps.search(testObj, test);

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

    it('should work with separator option set', function () {

      var expected = [
        { path: 'propF.moreNester.asdf',
          value: { someval: true,
            val1: 'good' },
          key: 'asdf' }
      ];

      var test = function (obj) {
        return obj.val1 === 'good';
      };

      var actual = ps.search(testObj, test, {separator: '.' });

      assert.equal(actual.length, expected.length, 'incorrect number of results.');
      assert.deepEqual(actual, expected, 'incorrect results');
    });

  });
});
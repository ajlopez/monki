
const contexts = require('../lib/contexts');

exports['get unknown variable'] = function (test) {
    const context = contexts.context();
    
    test.equal(context.get('foo'), null);
};

exports['set and get variable'] = function (test) {
    const context = contexts.context();
    
    context.set('answer', 42);
    
    test.equal(context.get('answer'), 42);
};

exports['get unknown variable in parent'] = function (test) {
    const parent = contexts.context();
    const context = contexts.context(parent);
    
    test.equal(context.get('foo'), null);
};

exports['get variable from parent'] = function (test) {
    const parent = contexts.context();
    parent.set('foo', 42);
    
    const context = contexts.context(parent);
    
    test.equal(context.get('foo'), 42);
    test.equal(parent.get('foo'), 42);
};

exports['get variable from child'] = function (test) {
    const parent = contexts.context();
    
    const context = contexts.context(parent);
    context.set('foo', 42);
    
    test.equal(context.get('foo'), 42);
    test.equal(parent.get('foo'), null);
};

exports['top context len built-in function'] = function (test) {
    const context = contexts.top();
    
    test.equal(context.get('len')("foo"), 3);
    test.equal(context.get('len')([ 42 ]), 1);
};

exports['top context first built-in function'] = function (test) {
    const context = contexts.top();
    
    test.equal(context.get('first')([1, 4, 9]), 1);
    test.equal(context.get('first')([]), null);
};

exports['top context rest built-in function'] = function (test) {
    const context = contexts.top();
    
    test.deepEqual(context.get('rest')([1, 4, 9]), [4, 9]);
    test.deepEqual(context.get('rest')([9]), []);
    test.deepEqual(context.get('rest')([]), null);
};

exports['top context push built-in function'] = function (test) {
    const context = contexts.top();
    
    const values = [ 1, 4, 9 ];
    
    test.deepEqual(context.get('push')([1, 4, 9], 16), [ 1, 4, 9, 16 ]);
    test.deepEqual(values, [ 1, 4, 9 ]);
};

exports['top context puts built-in function'] = function (test) {
    const result = [];
    
    const context = contexts.top({ println: function(arg) {
        result.push(arg);
        
        return result;
    }});
    
    test.equal(context.get('puts')(1, 4, 9), 9);
    test.deepEqual(result, [1, 4, 9]);
    test.equal(context.get('puts')(9), 9);
    test.deepEqual(result, [1, 4, 9, 9]);
    test.equal(context.get('puts')(), null);
    test.deepEqual(result, [1, 4, 9, 9]);
};


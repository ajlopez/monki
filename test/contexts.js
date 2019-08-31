
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
    test.deepEqual(context.get('rest')([]), []);
};


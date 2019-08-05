
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


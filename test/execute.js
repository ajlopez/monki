
const contexts = require('../lib/contexts');
const monki = require('../lib/monki');

const path = require('path');

exports['execute text'] = function (test) {
    const context = contexts.context();
    
    const result = monki.execute('let answer = 42;', context);
    
    test.equal(context.get('answer'), 42);
};

exports['execute file'] = function (test) {
    const filename = path.join(__dirname, 'files', 'Let.mon')
    const context = contexts.context();
    
    const result = monki.executeFile(filename, context);
    
    test.equal(context.get('one'), 1);
    test.equal(context.get('two'), 2);
    test.equal(context.get('answer'), 42);
};


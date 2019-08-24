
const contexts = require('../lib/contexts');
const monki = require('../lib/monki');

exports['execute command'] = function (test) {
    const context = contexts.context();
    
    const result = monki.execute('let answer = 42;', context);
    
    test.equal(context.get('answer'), 42);
};


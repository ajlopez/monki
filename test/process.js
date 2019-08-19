const interpreter = require('../lib/interpreter');
const parser = require('../lib/parser');
const contexts = require('../lib/contexts');

function process(test, text, expected, context) {
    const node = parser.parse('expression', text);
    const result = interpreter.process(node, context);
    
    test.strictEqual(result, expected);
}

function processc(test, text, expected, context) {
    const node = parser.parse('command', text);
    const result = interpreter.process(node, context);
    
    test.strictEqual(result, expected);
}

exports['process constants'] = function (test) {
    process(test, '42', 42);
    process(test, '"foo"', "foo");
    process(test, 'true', true);
    process(test, 'false', false);
};

exports['process arithmetic operations'] = function (test) {
    process(test, '41+1', 42);
    process(test, '43-1', 42);
    process(test, '21*2', 42);
    process(test, '84/2', 42);
};

exports['process name'] = function (test) {
    const context = contexts.context();
    context.set('answer', 42);
    
    process(test, 'answer', 42, context);
};

exports['process let command'] = function (test) {
    const context = contexts.context();
    
    processc(test, 'let answer = 42;', 42, context);
    test.equal(context.get('answer'), 42);
};

exports['process sequence command'] = function (test) {
    const context = contexts.context();
    
    processc(test, '{ let answer = 42; let one = 1; }', 1, context);
    test.equal(context.get('answer'), 42);
    test.equal(context.get('one'), 1);
};

exports['process expression command'] = function (test) {
    processc(test, '42;', 42);
};

exports['process if command'] = function (test) {
    const context = contexts.context();
    
    processc(test, 'if (true) let answer = 42;', 42, context);
    test.equal(context.get('answer'), 42);

    processc(test, 'if (false) let answer = 0; else let one = 1;', 1, context);
    test.equal(context.get('answer'), 42);
    test.equal(context.get('one'), 1);
};

exports['process fn expression and call'] = function (test) {
    const context = contexts.context();
    
    processc(test, '{ let increment = fn (a) { a + 1; }; increment(41); }', 42, context);
    
    test.ok(context.get('increment'));
};

exports['process fn expression and call using outer context'] = function (test) {
    const context = contexts.context();
    
    processc(test, '{ let one = 1; let increment = fn (a) { a + one; }; increment(41); }', 42, context);
    
    test.ok(context.get('increment'));
};


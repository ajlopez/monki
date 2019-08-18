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


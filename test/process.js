const interpreter = require('../lib/interpreter');
const parser = require('../lib/parser');
const contexts = require('../lib/contexts');

function process(test, text, expected, context) {
    const node = parser.parse('expression', text);
    const result = interpreter.process(node, context);

    test.deepEqual(result, expected);
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

exports['process integer division'] = function (test) {
    process(test, '3/2', 1);
    process(test, '-3/2', -2);
};

exports['process arithmetic operations using precedence'] = function (test) {
    process(test, '38+2*2', 42);
    process(test, '46-2*2', 42);
    process(test, '20*2+2', 42);
    process(test, '82/2+1', 42);
};

exports['process comparison operations'] = function (test) {
    process(test, '42==21*2', true);
    process(test, '42==41', false);
    process(test, '42!=1', true);
    process(test, '42!=42', false);
    process(test, '42<100', true);
    process(test, '42<=100', true);
    process(test, '42<10', false);
    process(test, '42>10', true);
    process(test, '42>=10', true);
    process(test, '42>=100', false);
};

exports['process or logical operator'] = function (test) {
    process(test, 'true||true', true);
    process(test, 'true||false', true);
    process(test, 'false||true', true);
    process(test, 'false||false', false);
    process(test, '0||true', true);
};

exports['process and logical operator'] = function (test) {
    process(test, 'true&&true', true);
    process(test, 'true&&false', false);
    process(test, 'false&&true', false);
    process(test, 'false&&false', false);
    process(test, '0&&true', 0);
};

exports['process unary operators'] = function (test) {
    process(test, '!true', false);
    process(test, '!false', true);
    process(test, '-42', -42);
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

exports['process fn expression with body that ends in an expression and call'] = function (test) {
    const context = contexts.context();
    
    processc(test, '{ let increment = fn (a) { a + 1 }; increment(41); }', 42, context);
    
    test.ok(context.get('increment'));
};

exports['process fn expression and call using outer context'] = function (test) {
    const context = contexts.context();
    
    processc(test, '{ let one = 1; let increment = fn (a) { a + one; }; increment(41); }', 42, context);
    
    test.ok(context.get('increment'));
};

exports['process fn expression and call using return'] = function (test) {
    const context = contexts.context();
    
    processc(test, '{ let analyze = fn (a) { if (a == 2) return true; return false; }; let a = analyze(2); let b = analyze(3); }', false, context);
    
    test.equal(context.get('a'), true);
    test.equal(context.get('b'), false);
};

exports['process array expressions'] = function (test) {
    process(test, '[ 1, 4, 9 ]', [ 1, 4, 9 ]);
    process(test, '[ ]', [ ]);
};

exports['process map expressions'] = function (test) {
    process(test, '{ "name": "Adam", "age": 900 }', { name: "Adam", age: 900 });
    process(test, '{ }', {});
};

exports['assign to array'] = function (test) {
    const context = contexts.context();
    
    processc(test, '{ let a = []; let a[1] = 1; let a[2] = 4; let a[3] = 9;  }', 9, context);

    test.equal(context.get('a')[1], 1);
    test.equal(context.get('a')[2], 4);
    test.equal(context.get('a')[3], 9);
};

exports['assign to map'] = function (test) {
    const context = contexts.context();
    
    processc(test, '{ let a = {}; let a["name"] = "Adam"; let a["age"] = 900; }', 900, context);

    test.equal(context.get('a').name, "Adam");
    test.equal(context.get('a').age, 900);
};

exports['evaluate native function call'] = function (test) {
    const context = contexts.context();
    context.set('add', function (x, y) { return x + y });
    
    process(test, 'add(2, 40)', 42, context);
};


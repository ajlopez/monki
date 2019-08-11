
const geast = require('geast');

const parser = require('../lib/parser');

function parse(test, type, text, expected) {
    test.deepEqual(geast.toObject(parser.parse(type, text)), expected);
}

exports['parse constants'] = function (test) {
    parse(test, 'integer', '42', { ntype: 'constant', value: 42 });
    parse(test, 'integer', '-3', { ntype: 'constant', value: -3 });
    parse(test, 'string', '"foo"', { ntype: 'constant', value: 'foo' });
    parse(test, 'boolean', 'true', { ntype: 'constant', value: true });
    parse(test, 'boolean', 'false', { ntype: 'constant', value: false });
};

exports['parse terms'] = function (test) {
    parse(test, 'term', '42', { ntype: 'constant', value: 42 });
    parse(test, 'term', '"foo"', { ntype: 'constant', value: 'foo' });
    parse(test, 'term', 'true', { ntype: 'constant', value: true });
    parse(test, 'term', 'false', { ntype: 'constant', value: false });
    parse(test, 'term', 'answer', { ntype: 'name', name: 'answer' });
};

exports['parse arithmetic expressions'] = function (test) {
    parse(test, 'expression', '40+2', { ntype: 'binary', operator: '+', left: { ntype: 'constant', value: 40 }, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '20*2+2', { ntype: 'binary', operator: '+', left: { ntype: 'binary', operator: '*', left: { ntype: 'constant', value: 20 }, right: { ntype: 'constant', value: 2 }}, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '80/2+2', { ntype: 'binary', operator: '+', left: { ntype: 'binary', operator: '/', left: { ntype: 'constant', value: 80 }, right: { ntype: 'constant', value: 2 }}, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '2+2*20', { ntype: 'binary', operator: '+', left: { ntype: 'constant', value: 2 }, right: { ntype: 'binary', operator: '*', left: { ntype: 'constant', value: 2 }, right: { ntype: 'constant', value: 20 }}});
    parse(test, 'expression', '2+80/2', { ntype: 'binary', operator: '+', left: { ntype: 'constant', value: 2 }, right: { ntype: 'binary', operator: '/', left: { ntype: 'constant', value: 80 }, right: { ntype: 'constant', value: 2 }}});
    parse(test, 'expression', '44-2', { ntype: 'binary', operator: '-', left: { ntype: 'constant', value: 44 }, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '21*2', { ntype: 'binary', operator: '*', left: { ntype: 'constant', value: 21 }, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '84/2', { ntype: 'binary', operator: '/', left: { ntype: 'constant', value: 84 }, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '(40+2)', { ntype: 'binary', operator: '+', left: { ntype: 'constant', value: 40 }, right: { ntype: 'constant', value: 2 }});
};

exports['parse comparison expressions'] = function (test) {
    parse(test, 'expression', '40<2', { ntype: 'binary', operator: '<', left: { ntype: 'constant', value: 40 }, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '40<=2', { ntype: 'binary', operator: '<=', left: { ntype: 'constant', value: 40 }, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '40>2', { ntype: 'binary', operator: '>', left: { ntype: 'constant', value: 40 }, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '40>=2', { ntype: 'binary', operator: '>=', left: { ntype: 'constant', value: 40 }, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '40==2', { ntype: 'binary', operator: '==', left: { ntype: 'constant', value: 40 }, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '40!=2', { ntype: 'binary', operator: '!=', left: { ntype: 'constant', value: 40 }, right: { ntype: 'constant', value: 2 }});
    parse(test, 'expression', '40<2*40', { ntype: 'binary', operator: '<', left: { ntype: 'constant', value: 40 }, right: { ntype: 'binary', operator: '*', left: { ntype: 'constant', value: 2 }, right: { ntype: 'constant', value: 40 } }});
};

exports['parse simple let command'] = function (test) {
    parse(test, 'command', 'let a = 42;', { ntype: 'assign', lefthand: { ntype: 'name', name: 'a' }, expression: { ntype: 'constant', value: 42 }});
};

exports['parse return command'] = function (test) {
    parse(test, 'command', 'return 42;', { ntype: 'return', expression: { ntype: 'constant', value: 42 }});
};

exports['parse expression command'] = function (test) {
    parse(test, 'command', '42;', { ntype: 'eval', expression: { ntype: 'constant', value: 42 }});
};

exports['parse array values'] = function (test) {
    parse(test, 'term', '[]', { ntype: 'array', values: [ ] });
    parse(test, 'term', '[ 42 ]', { ntype: 'array', values: [ { ntype: 'constant', value: 42 } ] });
    parse(test, 'term', '[ 1, 4, 9 ]', { ntype: 'array', values: [ { ntype: 'constant', value: 1 }, { ntype: 'constant', value: 4 }, { ntype: 'constant', value: 9 } ] });
};

exports['parse map values'] = function (test) {
    parse(test, 'term', '{}', { ntype: 'map', keyvalues: [ ] });
    parse(test, 'term', '{ "name": "Adam" }', { ntype: 'map', keyvalues: [ { ntype: 'keyvalue', key: { ntype: 'constant', value: 'name' }, value: { ntype: 'constant', value: 'Adam' } } ] });
    parse(test, 'term', '{ "name": "Adam", "age": 900 }', { ntype: 'map', keyvalues: [ { ntype: 'keyvalue', key: { ntype: 'constant', value: 'name' }, value: { ntype: 'constant', value: 'Adam' } }, { ntype: 'keyvalue', key: { ntype: 'constant', value: 'age' }, value: { ntype: 'constant', value: 900 } } ] });
};

exports['parse call'] = function (test) {
    parse(test, 'term', 'foo(1, 42)', { ntype: 'call', target: { ntype: 'name', name: 'foo' }, arguments: [ { ntype: 'constant', value: 1 }, { ntype: 'constant', value: 42 } ] });
};

exports['parse indexed term'] = function (test) {
    parse(test, 'term', 'foo[42]', { ntype: 'indexed', target: { ntype: 'name', name: 'foo' }, index: { ntype: 'constant', value: 42 } });
};

exports['parse composite command'] = function (test) {
    parse(test, 'command', '{ }', { ntype: 'sequence', nodes: [ ]});
    parse(test, 'command', 'let a = 42; }', { ntype: 'assign', lefthand: { ntype: 'name', name: 'a' }, expression: { ntype: 'constant', value: 42 } });
    parse(test, 'command', 'return a; }', { ntype: 'return', expression: { ntype: 'name', name: 'a' } });
    parse(test, 'cmdlist', 'let a = 42; }', [{ ntype: 'assign', lefthand: { ntype: 'name', name: 'a' }, expression: { ntype: 'constant', value: 42 } }]);
    parse(test, 'cmdlist', 'return a; }', [{ ntype: 'return', expression: { ntype: 'name', name: 'a' } }]);
    parse(test, 'cmdlist', 'let a = 42; return a; }', [{ ntype: 'assign', lefthand: { ntype: 'name', name: 'a' }, expression: { ntype: 'constant', value: 42 } }, { ntype: 'return', expression: { ntype: 'name', name: 'a' } }]);
    parse(test, 'command', '{ let a = 42; }', { ntype: 'sequence', nodes: [ { ntype: 'assign', lefthand: { ntype: 'name', name: 'a' }, expression: { ntype: 'constant', value: 42 } }]});
    parse(test, 'command', '{ let a = 42; return a; }', { ntype: 'sequence', nodes: [ { ntype: 'assign', lefthand: { ntype: 'name', name: 'a' }, expression: { ntype: 'constant', value: 42 } }, { ntype: 'return', expression: { ntype: 'name', name: 'a' }}]});
};

exports['parse if command'] = function (test) {
    parse(test, 'command', 'if (a) return 42;', { ntype: 'conditional', condition: { ntype: 'name', name: 'a' }, then: { ntype: 'return', expression: { ntype: 'constant', value: 42 } }});
};


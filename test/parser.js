
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


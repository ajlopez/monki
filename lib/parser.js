
const gepars = require('gepars');
const geast = require('geast');

const lexers = require('./lexers');

const pdef = gepars.definition();

geast.node('array', [ 'values' ]);
geast.node('map', [ 'keyvalues' ]);
geast.node('keyvalue', [ 'key', 'value' ]);

// commands
pdef.define('command', [ 'name:let', 'name', 'operator:=', 'expression', 'delimiter:;' ], function (values) { return geast.assign(values[1], values[3]); });

// expressions
pdef.define('expression', 'expression0');
pdef.define('expression0', 'expression1');
pdef.define('expression0', [ 'expression0', 'binop0', 'expression1' ], function (values) { return geast.binary(values[1], values[0], values[2]); });
pdef.define('expression1', 'expression2');
pdef.define('expression1', [ 'expression1', 'binop1', 'expression2' ], function (values) { return geast.binary(values[1], values[0], values[2]); });
pdef.define('expression2', 'term');
pdef.define('expression2', [ 'expression2', 'binop2', 'term' ], function (values) { return geast.binary(values[1], values[0], values[2]); });

pdef.define('binop0', 'operator:<');
pdef.define('binop0', 'operator:<=');
pdef.define('binop0', 'operator:>');
pdef.define('binop0', 'operator:>=');
pdef.define('binop0', 'operator:==');
pdef.define('binop0', 'operator:!=');

pdef.define('binop1', 'operator:+');
pdef.define('binop1', 'operator:-');

pdef.define('binop2', 'operator:*');
pdef.define('binop2', 'operator:/');

// terms
pdef.define('term', 'integer');
pdef.define('term', 'string');
pdef.define('term', 'boolean');
pdef.define('term', 'name');
pdef.define('term', 'array');
pdef.define('term', 'map');
pdef.define('term', [ 'delimiter:(', 'expression', 'delimiter:)' ], function (values) { return values[1]; });

// array
pdef.define('array', [ 'delimiter:[', 'exprlist', 'delimiter:]' ], function (values) { return geast.array(values[1]); });
pdef.define('exprlist', [ '!', 'delimiter:]' ], function (values) { return []; });
pdef.define('exprlist', [ 'expression', '!', 'delimiter:]' ], function (values) { return [ values[0] ]; });
pdef.define('exprlist', [ 'expression', 'delimiter:,', 'exprlist' ], function (values) { values[2].unshift(values[0]); return values[2]; });

// map
pdef.define('map', [ 'delimiter:{', 'kvlist', 'delimiter:}' ], function (values) { return geast.map(values[1]); });
pdef.define('kvlist', [ '!', 'delimiter:}' ], function (values) { return []; });
pdef.define('kvlist', [ 'keyvalue', '!', 'delimiter:}' ], function (values) { return [ values[0] ]; });
pdef.define('kvlist', [ 'keyvalue', 'delimiter:,', 'kvlist' ], function (values) { values[2].unshift(values[0]); return values[2]; });
pdef.define('keyvalue', [ 'string', 'delimiter::', 'expression' ], function (values) { return geast.keyvalue(values[0], values[2]); });

pdef.define('name', 'name:', function (value) { return geast.name(value); });

// constants
pdef.define('integer', 'integer:', function (value) { return geast.constant(parseInt(value)); });
pdef.define('integer', [ 'operator:-', 'integer:' ], function (values) { return geast.constant(-parseInt(values[1])); });
pdef.define('string', 'string:', function (value) { return geast.constant(value); });
pdef.define('boolean', 'name:true', function (value) { return geast.constant(true); });
pdef.define('boolean', 'name:false', function (value) { return geast.constant(false); });

function parseNode(type, text) {
    const lexer = lexers.lexer(text);   
    const parser = pdef.parser(lexer);
    
    return parser.parse(type);
}

module.exports = {
    parse: parseNode
}

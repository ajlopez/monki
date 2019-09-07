
const gepars = require('gepars');
const geast = require('geast');

const lexers = require('./lexers');

const pdef = gepars.definition();

geast.node('array', [ 'values' ]);
geast.node('map', [ 'keyvalues' ]);
geast.node('keyvalue', [ 'key', 'value' ]);
geast.node('function', [ 'parameters', 'body' ]);

// program
pdef.define('program', 'commandlist', function (value) { return geast.sequence(value); });
pdef.define('commandlist', 'command', function (value) { return [ value ]; });
pdef.define('commandlist', [ '!', 'null' ], function (values) { return [] });
pdef.define('commandlist', [ 'commandlist', 'command' ], function (values) { values[0].push(values[1]); return values[0]; });

// commands
pdef.define('command', [ 'name:if', 'delimiter:(', 'expression', 'delimiter:)', 'command', 'name:else', 'command' ], function (values) { return geast.conditional(values[2], values[4], values[6]); });
pdef.define('command', [ 'name:if', 'delimiter:(', 'expression', 'delimiter:)', 'command' ], function (values) { return geast.conditional(values[2], values[4]); });
pdef.define('command', [ 'name:while', 'delimiter:(', 'expression', 'delimiter:)', 'command' ], function (values) { return geast.loop(values[2], values[4]); });
pdef.define('command', [ 'name:let', 'lefthand', 'operator:=', 'expression', 'delimiter:;' ], function (values) { return geast.assign(values[1], values[3]); });
pdef.define('lefthand', [ 'lefthand', 'delimiter:[', 'expression', 'delimiter:]' ], function (values) { return geast.indexed(values[0], values[2]); });
pdef.define('lefthand', 'name');
pdef.define('command', [ 'name:return', 'expression', 'delimiter:;' ], function (values) { return geast.return(values[1]); });
pdef.define('command', [ 'expression', 'delimiter:;' ], function (values) { return geast.eval(values[0]); });
pdef.define('command', [ 'delimiter:{', 'cmdlist', 'delimiter:}' ], function (values) { return geast.sequence(values[1]); });
pdef.define('cmdlist', [ '!', 'delimiter:}' ], function (values) { return []; });
pdef.define('cmdlist', [ 'command', 'cmdlist' ], function (values) { values[1].unshift(values[0]); return values[1]; });

// expressions
pdef.define('expression', 'function');
pdef.define('expression', 'expressionlog0');
pdef.define('expressionlog0', 'expression0');
pdef.define('expressionlog0', [ 'expressionlog0', 'binlogop0', 'expression0' ], function (values) { return geast.binary(values[1], values[0], values[2]); });
pdef.define('expression0', 'expression1');
pdef.define('expression0', [ 'expression0', 'binop0', 'expression1' ], function (values) { return geast.binary(values[1], values[0], values[2]); });
pdef.define('expression1', 'expression2');
pdef.define('expression1', [ 'expression1', 'binop1', 'expression2' ], function (values) { return geast.binary(values[1], values[0], values[2]); });
pdef.define('expression2', 'expression3');
pdef.define('expression2', [ 'expression2', 'binop2', 'expression3' ], function (values) { return geast.binary(values[1], values[0], values[2]); });
pdef.define('expression3', [ 'operator:-', 'expression3' ], function (values) { return geast.unary('-', values[1]); });
pdef.define('expression3', [ 'operator:!', 'expression3' ], function (values) { return geast.unary('!', values[1]); });
pdef.define('expression3', 'term');

pdef.define('function', [ 'name:fn', 'delimiter:(', 'arglist', 'delimiter:)', 'command' ], function (values) { return geast.function(values[2], values[4]); });
pdef.define('arglist', [ '!', 'delimiter:)' ], function (values) { return []; });
pdef.define('arglist', [ 'name:', '!', 'delimiter:)' ], function (values) { return [ values[0] ]; });
pdef.define('arglist', [ 'name:', 'delimiter:,', 'arglist' ], function (values) { values[2].unshift(values[0]); return values[2]; });

pdef.define('binlogop0', 'operator:||');
pdef.define('binlogop0', 'operator:&&');

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
pdef.define('term', [ 'term', 'delimiter:(', 'exprlist', 'delimiter:)' ], function (values) { return geast.call(values[0], values[2]); });
pdef.define('term', [ 'term', 'delimiter:[', 'expression', 'delimiter:]' ], function (values) { return geast.indexed(values[0], values[2]); });
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
pdef.define('exprlist', [ '!', 'delimiter:)' ], function (values) { return []; });
pdef.define('exprlist', [ 'expression', '!', 'delimiter:)' ], function (values) { return [ values[0] ]; });

// map
pdef.define('map', [ 'delimiter:{', 'kvlist', 'delimiter:}' ], function (values) { return geast.map(values[1]); });
pdef.define('kvlist', [ '!', 'delimiter:}' ], function (values) { return []; });
pdef.define('kvlist', [ 'keyvalue', '!', 'delimiter:}' ], function (values) { return [ values[0] ]; });
pdef.define('kvlist', [ 'keyvalue', 'delimiter:,', 'kvlist' ], function (values) { values[2].unshift(values[0]); return values[2]; });
pdef.define('keyvalue', [ 'expression', 'delimiter::', 'expression' ], function (values) { return geast.keyvalue(values[0], values[2]); });

pdef.define('name', 'name:', function (value) { return geast.name(value); });

// constants
pdef.define('integer', 'integer:', function (value) { return geast.constant(parseInt(value)); });
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


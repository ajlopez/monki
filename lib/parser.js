
const gepars = require('gepars');
const geast = require('geast');

const lexers = require('./lexers');

const pdef = gepars.definition();

// terms
pdef.define('term', 'integer');
pdef.define('term', 'string');
pdef.define('term', 'boolean');
pdef.define('term', 'name');

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


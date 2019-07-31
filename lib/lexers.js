
const gelex = require('gelex');
const ldef = gelex.definition();

const TokenType = { Name: 'name', Integer: 'integer', Real: 'real' };

ldef.define(TokenType.Real, '[0-9][0-9]*.[0-9][0-9]*');
ldef.define(TokenType.Integer, '[0-9][0-9]*');
ldef.define(TokenType.Name, '[a-zA-Z_][a-zA-Z0-9_]*');
ldef.defineComment('/*', '*/');
ldef.defineComment('//');

function createLexer(text) {
    return ldef.lexer(text);
}

module.exports = {
    lexer: createLexer,
    TokenType: TokenType
}


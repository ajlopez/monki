
const gelex = require('gelex');
const ldef = gelex.definition();

const TokenType = { Name: 'name', Integer: 'integer', String: 'string', Delimiter: 'delimiter', Operator: 'operator', Keyword: 'keyword' };

ldef.define(TokenType.Integer, '[0-9][0-9]*');
ldef.define(TokenType.Keyword, 'if else fn while let return true false'.split(' '));
ldef.define(TokenType.Name, '[a-zA-Z_][a-zA-Z0-9_]*');
ldef.define(TokenType.Delimiter, ';:,().{}[]'.split(''));
ldef.define(TokenType.Operator, '+-*/<>=!'.split(''));
ldef.define(TokenType.Operator, '<= >= == !='.split(' '));
ldef.define(TokenType.Operator, '|| &&'.split(' '));
ldef.defineText(TokenType.String, '"', '"',
    {
        escape: '\\',
        escaped: { 'n': '\n', 'r': '\r', 't': '\t' }
    }
);
ldef.defineComment('/*', '*/');
ldef.defineComment('//');

function createLexer(text) {
    return ldef.lexer(text);
}

module.exports = {
    lexer: createLexer,
    TokenType: TokenType
}


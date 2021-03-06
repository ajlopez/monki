
const lexers = require('../lib/lexers');
const TokenType = lexers.TokenType;

exports['create lexer as object'] = function (test) {
    const lexer = lexers.lexer('foo');
    
    test.ok(lexer);
    test.equal(typeof lexer, 'object');
};

exports['first token'] = function (test) {
    const lexer = lexers.lexer('foo');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'foo');
    test.equal(token.type, TokenType.Name);
    
    test.equal(lexer.next(), null);
};

exports['first token skipping comment'] = function (test) {
    const lexer = lexers.lexer('/* a comment */foo');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'foo');
    test.equal(token.type, TokenType.Name);
    
    test.equal(lexer.next(), null);
};

exports['first token skipping line comment'] = function (test) {
    const lexer = lexers.lexer('// a comment \r\nfoo');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'foo');
    test.equal(token.type, TokenType.Name);
    
    test.equal(lexer.next(), null);
};

exports['no token in empty string'] = function (test) {
    const lexer = lexers.lexer('');
    
    test.equal(lexer.next(), null);
};

exports['name skipping spaces'] = function (test) {
    const lexer = lexers.lexer('  foo   ');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'foo');
    test.equal(token.type, TokenType.Name);
    
    test.equal(lexer.next(), null);
};

exports['two names'] = function (test) {
    const lexer = lexers.lexer('foo bar');
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'foo');
    test.equal(token.type, TokenType.Name);
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'bar');
    test.equal(token.type, TokenType.Name);
    
    test.equal(lexer.next(), null);
};

exports['integer'] = function (test) {
    const lexer = lexers.lexer('42');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, '42');
    test.equal(token.type, TokenType.Integer);
    
    test.equal(lexer.next(), null);
};

exports['string'] = function (test) {
    const lexer = lexers.lexer('"foo"');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'foo');
    test.equal(token.type, TokenType.String);
    
    test.equal(lexer.next(), null);
};

exports['string with escaped characters'] = function (test) {
    const lexer = lexers.lexer('"\\tfoo\\r\\n"');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, '\tfoo\r\n');
    test.equal(token.type, TokenType.String);
    
    test.equal(lexer.next(), null);
};

exports['string and name'] = function (test) {
    const lexer = lexers.lexer('"foo" bar');
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'foo');
    test.equal(token.type, TokenType.String);
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'bar');
    
    test.equal(token.type, TokenType.Name);
    
    test.equal(lexer.next(), null);
};

exports['semicolon as delimiter'] = function (test) {
    const lexer = lexers.lexer(';');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, ';');
    test.equal(token.type, TokenType.Delimiter);
    
    test.equal(lexer.next(), null);
};

exports['comma as delimiter'] = function (test) {
    const lexer = lexers.lexer(',');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, ',');
    test.equal(token.type, TokenType.Delimiter);
    
    test.equal(lexer.next(), null);
};

exports['parentheses as delimiters'] = function (test) {
    const lexer = lexers.lexer('()');
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, '(');
    test.equal(token.type, TokenType.Delimiter);
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, ')');
    test.equal(token.type, TokenType.Delimiter);
    
    test.equal(lexer.next(), null);
};

exports['brackets as delimiters'] = function (test) {
    const lexer = lexers.lexer('{}');
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, '{');
    test.equal(token.type, TokenType.Delimiter);
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, '}');
    test.equal(token.type, TokenType.Delimiter);
    
    test.equal(lexer.next(), null);
};

exports['square brackets as delimiters'] = function (test) {
    const lexer = lexers.lexer('[]');
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, '[');
    test.equal(token.type, TokenType.Delimiter);
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, ']');
    test.equal(token.type, TokenType.Delimiter);
    
    test.equal(lexer.next(), null);
};

exports['dot as delimiter'] = function (test) {
    const lexer = lexers.lexer('.');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, '.');
    test.equal(token.type, TokenType.Delimiter);
    
    test.equal(lexer.next(), null);
};

exports['minus as operator'] = function (test) {
    const lexer = lexers.lexer('-');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, '-');
    test.equal(token.type, TokenType.Operator);
    
    test.equal(lexer.next(), null);
};

exports['logical and or operators'] = function (test) {
    const lexer = lexers.lexer('|| &&');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, '||');
    test.equal(token.type, TokenType.Operator);
  
    const token2 = lexer.next();
    
    test.ok(token2);
    test.equal(token2.value, '&&');
    test.equal(token2.type, TokenType.Operator);
    
    test.equal(lexer.next(), null);
};

exports['exclamation mark as operator'] = function (test) {
    const lexer = lexers.lexer('!');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, '!');
    test.equal(token.type, TokenType.Operator);
    
    test.equal(lexer.next(), null);
};

exports['name and delimiter'] = function (test) {
    const lexer = lexers.lexer('foo;');
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'foo');
    test.equal(token.type, TokenType.Name);
  
    var token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, ';');
    test.equal(token.type, TokenType.Delimiter);
    
    test.equal(lexer.next(), null);
};

exports['if as keyword'] = function (test) {
    const lexer = lexers.lexer('if');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'if');
    test.equal(token.type, TokenType.Keyword);
    
    test.equal(lexer.next(), null);
};

exports['else as keyword'] = function (test) {
    const lexer = lexers.lexer('else');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'else');
    test.equal(token.type, TokenType.Keyword);
    
    test.equal(lexer.next(), null);
};

exports['fn as keyword'] = function (test) {
    const lexer = lexers.lexer('fn');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'fn');
    test.equal(token.type, TokenType.Keyword);
    
    test.equal(lexer.next(), null);
};

exports['true and false as keywords'] = function (test) {
    const lexer = lexers.lexer('true false');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'true');
    test.equal(token.type, TokenType.Keyword);
  
    const token2 = lexer.next();
    
    test.ok(token2);
    test.equal(token2.value, 'false');
    test.equal(token2.type, TokenType.Keyword);
    
    test.equal(lexer.next(), null);
};

exports['if as keyword'] = function (test) {
    const lexer = lexers.lexer('while let return');
  
    const token = lexer.next();
    
    test.ok(token);
    test.equal(token.value, 'while');
    test.equal(token.type, TokenType.Keyword);
  
    const token2 = lexer.next();
    
    test.ok(token2);
    test.equal(token2.value, 'let');
    test.equal(token2.type, TokenType.Keyword);
  
    const token3 = lexer.next();
    
    test.ok(token3);
    test.equal(token3.value, 'return');
    test.equal(token3.type, TokenType.Keyword);
    
    test.equal(lexer.next(), null);
};


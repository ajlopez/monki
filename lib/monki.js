
const parser = require('./parser');
const interpreter = require('./interpreter');

function execute(text, context) {
    const program = parser.parse('program', text);
    
    return interpreter.process(program, context);
}

module.exports = {
    execute: execute
}


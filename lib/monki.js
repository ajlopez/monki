
const parser = require('./parser');
const interpreter = require('./interpreter');

const fs = require('fs');

function execute(text, context) {
    const program = parser.parse('program', text);
    
    return interpreter.process(program, context);
}

function executeFile(filename, context) {
    const text = fs.readFileSync(filename).toString();
    
    return execute(text, context);
}

module.exports = {
    execute: execute,
    executeFile: executeFile
}


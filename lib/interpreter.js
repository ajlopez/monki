
const contexts = require('./contexts');

function XFunction(parameters, body, context) {
    const nparameters = parameters.length;
    
    this.execute = function (args) {
        const newcontext = contexts.context(context);
        
        for (let k = 0; k < nparameters; k++)
            newcontext.set(parameters[k], args[k]);
        
        const interpreter = new Interpreter(newcontext);
        
        return interpreter.process(body);
    };
}

function Interpreter(context) {
    this.process = function (node) {
        return node.process(this);
    };
    
    this.processConstant = function (node) {
        return node.value();
    };
    
    this.processName = function (node) {
        return context.get(node.name());
    };
    
    this.processAssign = function (node) {
        // TODO assign to indexed expression
        const name = node.lefthand().name();
        const value = this.process(node.expression());
        context.set(name, value);
        return value;
    };
    
    this.processSequence = function (node) {
        const nodes = node.nodes();
        let value;
        
        for (let k = 0, l = nodes.length; k < l; k++)
            value = this.process(nodes[k]);
        
        return value;
    };
    
    this.processEval = function (node) {
        return this.process(node.expression());
    };
    
    this.processConditional = function (node) {
        const condition = this.process(node.condition());
        const then = node.then();
        const els = node.else();
        
        if (condition)
            return this.process(then);
        
        if (els)
            return this.process(els);
    };
    
    this.processFunction = function (node) {
        return new XFunction(node.parameters(), node.body(), context);
    };
    
    this.processCall = function (node) {
        const target = this.process(node.target());
        const args = node.arguments();
        const argvalues = [];
        
        for (let k = 0, l = args.length; k < l; k++)
            argvalues[k] = this.process(args[k]);
        
        return target.execute(argvalues);
    };
    
    this.processBinary = function (node) {
        const operator = node.operator();
        const leftvalue = this.process(node.left());
        const rightvalue = this.process(node.right());
        
        return leftvalue + rightvalue;
    };
}

module.exports = {
    process: function (node, context) { return (new Interpreter(context)).process(node); }
}


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
}

module.exports = {
    process: function (node, context) { return (new Interpreter(context)).process(node); }
}

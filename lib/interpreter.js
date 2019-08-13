
function Interpreter(context) {
    this.process = function (node) {
        return node.process(this);
    };
    
    this.processConstant = function (node) {
        return node.value();
    };
}

module.exports = {
    process: function (node, context) { return (new Interpreter(context)).process(node); }
}

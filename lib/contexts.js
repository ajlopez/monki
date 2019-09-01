
function Context(parent) {
    const values = {};
    
    this.get = function (name) { 
        if (values[name] === undefined && parent)
            return parent.get(name);
        
        return values[name]; 
    };
    
    this.set = function (name, value) { values[name] = value; };
}

function createContext(parent) {
    return new Context(parent);
}

function createTopContext() {
    const context = createContext();
    
    context.set('len', function (arg) { return arg.length; });
    context.set('first', function (arg) { return arg[0]; });
    context.set('rest', function (arg) { return arg.length ? arg.slice(1) : null; });
    
    return context;
}

module.exports = {
    context: createContext,
    top: createTopContext
};


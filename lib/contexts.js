
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

function createTopContext(options) {
    const context = createContext();
    const println = options && options.println ? options.println : console.log;
    
    context.set('len', function (arg) { return arg.length; });
    context.set('first', function (arg) { return arg[0]; });
    context.set('rest', function (arg) { return arg.length ? arg.slice(1) : null; });
    context.set('push', function (arg, val) { const result = arg.slice(); result.push(val); return result; });
    
    context.set('puts', function () {
        let value = null;
        
        for (let n in arguments)
            println(value = arguments[n]);
        
       return value;
    });
    
    return context;
}

module.exports = {
    context: createContext,
    top: createTopContext
};


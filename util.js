var _ = require('./underscore.js');

//module.exports = {
//
//    fail: function(thing){
//        throw new Error(thing);
//    },
//    
//    warn: function(thing){
//        console.log(["WARNING",thing].join(': '));
//    },
//
//    note: function(thing){
//        console.log(['NOTE',thing].join(': '));
//    },
//
//    isIndexed: function(thing){
//        return _.isArray(thing) || _.isString(thing);
//    },
//
//    existy: function(thing){
//        return thing != null;
//    },
//
/*    if we write like this to export these functions ,when we invoke othero
      one ,we have to access then via this,because they are in the scope of
      module.exports object.
*/
//    truthy: function(thing){
//        return thing !== false && this.existy(thing);
//    }
//}



var fail = exports.fail= function(thing){
    thrownewError(thing);
};

var warn = exports.warn = function(thing){
    console.log(["WARNING",thing].join('='));
};

var note = exports.note = function(thing){
    console.log(['NOTE',thing].join('='));
};

var isIndexed = exports.isIndexed = function(thing){
    return _.isArray(thing) || _.isString(thing);
};

var existy = exports.existy = function(thing){
    return thing!=null;
};

var truthy = exports.truthy = function(thing){
    return thing !== false && existy(thing);
}

var doWhen = exports.doWhen = function(cond,action){
    if(truthy(cond)) return action();
    return undefined;
}

var allOf = exports.allOf = function(/*functions*/){
    /**
        allof : accept a list of predicate functions ,
                and return true only if every predicate function returns ture
    */

    var times = 1;
    return _.reduceRight(arguments,function(truth,func){
        console.log(times++);
        return  truth && func();
    },true);
}


var allOf = exports.anyOf = function(/*functions*/){
    /**
        anyOf : accept a list of predicate functions ,
                and return true   if any of  predicate function returns ture
                in another word,it returns false only if all predicate functions
                returns false.
    */
    
    var times = 1;
    return _.reduceRight(arguments,function(truth,func){
        console.log(times++);
        return  truth ||  func();
    },true);
}

var EscapeReduceError = function(msg){
    this.name = "EscapeReduceError";
    this.message = msg;
}

EscapeReduceError.prototype = new Error();

var allOf_Short = exports.anyOf_Short = function(/*functions*/){
    /**
        anyOf : accept a list of predicate functions ,
                and return true   if any of  predicate function returns ture
                in another word,it returns false only if all predicate functions
                returns false.
    */
    
    var times = 1;
    try{
        _.reduceRight(arguments,function(truth,func){
             console.log(times++);
             var result = func();
             if(result) throw new EscapeReduceError('i escaped reduce');
             return false;
        },true);
    }catch(e){
        if(e instanceof EscapeReduceError) return true;
        if(e instanceof Error)  throw e;
        return false;
    }
}

/**
    allOf and anyOf : neither of them apply the short circuit logic.
    normally,when we evaluate the value of expression:
        expressionA || expressionB || expressionC || ...
     we eval from left to right,when we have a value of true,then we return true 
     and stop to continue eval left expressions. 
*/



var cat = exports.cat = function(){
    // this function is used to concatenate given arrays and returns a flattened array
    //and its first argument must be an array;

    var head = _.first(arguments);
    if(existy(head)){
        return head.concat.apply(head,_.rest(arguments));
    }else{
        return false
    }
}

var construct = exports.construct = function(head,tail){
    return cat([head],_.toArray(tail));
}


var finder = exports.finder = function(getValue,chooseBestValue,collection){
    return _.reduce(collection,function(best,cureent){
        var bestValue = getValue(best);
        var currentValue = getValue(current);
        return (bestValue === chooseBestValue(bestValue,currentValue) ? best : current);
    });
}


/**
    tighten finder up a bit:
    1. chooseBestValue function returns true if the first argument is betterthan the second one.
    2. the chooseBestValue function knows how to 'unwrap' its arguments
*/

var best = exports.best = function(func,collection){
    return _.reduce(collection,function(best,current){
        return func(best,current) ? best ； current;
    });
}


var repeat = exports.repeat = function(times,VALUE){
    return _.map(_.range(times),function(value){
        return VALUE;
    });
}

// use functions ,not values

var repeatedly = exports.repeatedly = function(times,func){
    return _.map(_.range(times),func);
}

//we do not know how many times to literate.but we know the condition to stop literate;
//and we can also feed-forward the result of the previous function to the next function to call.

var literateUntil = exports.literateUntil = function(perform,check,initState){
    var ret = [];
    var result = perform(initState);
    while(check(result)){
       ret.push(result);
       result = perform(result);
    }
}

//a function that always return a contant;

var always = exports.always = function(VALUE){
    return function(){
        return VALUE;
    }
}


var invoker = exports.invoker = function(NAME,METHOD){
    return function(target /**arguments for the method*/){
        if( !existy(target) ) fail("invoker: you must supply a target to call method of"); 
        var targetMethod = target[NAME];
        var args = _.rest(arguments);
        return doWhen(targetMethod === METHOD,function(){
            return targetMethod.apply(target,args);
        }); 
    }
}


var fnull = exports.fnull = function(func){
    var defaults = _.rest(arguments);
    return function(){
        var args = _.toArray(arguments);
        var params = _.reduce(defaluts,function(result,item,index){
            if(existy(args[index])){
                return result;
            }else{
                args[index] = item;
                return args;
            }
        },args); 
        return func.apply(func,params);
    }
}

//invoke every function given on the obj,and returns an array of errors;

var checker = exports.checker = function(/*functions for checking*/){
    var validators= _.toArray(arguments);
    return function(obj){
        _.reduce(validators,function(error,validator){
            if(validator(obj)){
                return error;
            }else{
                return _.chain(error).push(validator.message).value();
            }
        },[]);
    }
}

//form polymorpic functions;
//exhibit different behaviors based on their arguments;

var dispatch = exports.dispatch = function(/**funcs*/){
    var funcs = _.toArray(arguments);
    var size = funcs.length;
    return function(obj/**args*/){
      var result = undefined;
      var args = _.rest(arguments);
      for(var i=0;i<size;i++){
        result = func[i].apply(obj,args);
        //result = func[i].apply(func[i],construct(obj,args));
        if(existy(result)) 
            return result;
      }
      return return;
    }
}

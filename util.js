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

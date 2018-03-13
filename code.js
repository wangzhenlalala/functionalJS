var _ = require('./underscore.js');
var util = require('./util.js')

var executeIfHasFeild = function(obj,property){
    return util.doWhen(util.truthy(obj[property]),function(){
        var result = _.result(obj,property);
        console.log(['the result is',result].join(' : '));
        return result;
    });
}

executeIfHasFeild([1,2,3],'reverse');

var pred1 = function(){ return true}
var pred2 = function(){ return false }

//var result_AllOf = util.allOf(pred1,pred2,pred1);
//var result_AnyOf = util.anyOf(pred1,pred2);
//console.log(result_AllOf);
var result_AnyOf_Short = util.anyOf_Short(pred1,pred2,pred1,pred2,pred2);
//console.log(result_AnyOf);
console.log(result_AnyOf_Short);


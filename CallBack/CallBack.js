'use strict'
var a = function(callback){
	setTimeout(function(){
		console.log("I am function A");
		callback();
		},getRandomArbitary(1000,10000));
};
var b = function(callback){
	setTimeout(function(){
		console.log("I am function B");
		callback();
		},getRandomArbitary(1000,10000));
};
var c = function(callback){
	setTimeout(function(){
		console.log("I am function C");
		callback();
		},getRandomArbitary(1000,10000));
	
};
var arrayOfFunctions = [];
arrayOfFunctions.push(a);
arrayOfFunctions.push(b);
arrayOfFunctions.push(c);
// arrayOfFunctions.push(function(){});
function getRandomArbitary(min, max)
{
	return Math.random() * (max - min) + min;
}

function CreateSequence(arrayOfFunctions)
{
   return arrayOfFunctions.reduceRight(function(previousValue, currentValue, index, array) {
	   return function(){		 
		   currentValue(previousValue);		   
	   }		   
	   
   },function(){});
}

var sequence = CreateSequence(arrayOfFunctions);
sequence();
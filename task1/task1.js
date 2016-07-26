'use strict'
function Scope() {

    // List of watchers
    this.$$watchers = [];

    //List of asyncQueue
    this.$$asyncQueue = [];

    //List of postDigests
    this.$$postDigests = [];

    //Current phase
	this.$$phase = null;
};
// Apply------------------------------------------------------------------------------------------

//Eval get function as param, call this function and return result.
Scope.prototype.$eval = function(func, params) {
	try {
		return func(this, params);
	}
	catch (e) {
		console.error(e);
	}
};

// Apply
Scope.prototype.$apply = function(func) {
	try {
		this.$phaseStart('$Apply phase');
    	return this.$eval(func);
  	} 
  	finally {
  		this.$phaseEnd();
    	this.$digest();
  	}
}
//--------------------------------------------------------------------------------------------------


//-----Watch,WatchGroup--------------------------------------------------
Scope.prototype.$watch = function(watchFn,listenerFn,valueEq) {
	var that = this,
		watcher = {
		watchFn: watchFn,
    	listenerFn: listenerFn || function(){},
    	valueEq: !!valueEq
	};
	that.$$watchers.push(watcher);
	//--- Return function that can delete watcher when we'll need it.
	return function() {
		if (that.$$watchers.indexOf(watcher) >= 0) {
			that.$$watchers.splice(that.$$watchers.indexOf(watcher), 1);
		}
	};

};

Scope.prototype.$watchGroup = function(watchExpressions,listenerFn){
	var that = this,i,
		n = watchExpressions.length,
		i,deleteWatchGroup = new Array(n);
	for (i=0; i < n ;i++) {
		deleteWatchGroup[i] = that.$watch(watchExpressions[i],listenerFn,true);
	}
	return function() {
		while (deleteWatchGroup.length) {
			deleteWatchGroup.shift()();
			}
	}
}




//-----------------Digest,DigestOnece--------------------------------------------------

Scope.prototype.$$digestOnce = function() {
	var that = this,
		i,
		dirty,
		isEqual,
		prevValue,
		currentValue;	
	try {
		for (i=0;i < this.$$watchers.length;i++) {
			currentValue = this.$$watchers[i].watchFn(that);
			prevValue = this.$$watchers[i].last;
			if (this.$$watchers[i].valueEq) {
    			isEqual = _.isEqual(currentValue, prevValue);
  			} 
  			else {
   				isEqual = (currentValue === prevValue) || (_.isNumber(currentValue) && _.isNumber(prevValue) && _.isNaN(currentValue) && _.isNaN(prevValue));
 			}
			if (!isEqual) {
				this.$$watchers[i].listenerFn(currentValue,prevValue,that);
				dirty = true;
			}
			if (this.$$watchers[i].valueEq) {
				this.$$watchers[i].last = _.cloneDeep(currentValue);
			}
			else {
				this.$$watchers[i].last = currentValue;
			}
		}
	}
	catch (e) {
		console.error(e);
	}
	return dirty;
}




Scope.prototype.$digest = function() {
	var dirty,
		async,
		maxCount = 0;
	this.$phaseStart('$digest phase');
	do {
    	while (this.$$asyncQueue.length) {
    		try {
      			async = this.$$asyncQueue.shift();
      			this.$eval(async.expression);
      		}
      		catch (e) {
      			console.error(e);
      		}
    	}
    	dirty = this.$$digestOnce();
    	if ((dirty || this.$$asyncQueue.length) && (maxCount == 10)) {
      		this.$phaseEnd();
      		throw '10 digest iterations reached';
    	}
  	} while (dirty);
	this.$phaseEnd();
	while (this.$$postDigests.length) {
		try {
			this.$$postDigests.shift()();
		}
		catch (e) {
			console.error(e);
		}
  	}
}
//------------------------------------------------------------------------------------------------------



//---------------Phases---------------------------------------------------------------------------------

Scope.prototype.$phaseStart = function(phase) {
  if (this.$$phase) {
    throw 'Phase \'' + this.$$phase + '\' already in progress.';
  }
  this.$$phase = phase;
};
Scope.prototype.$phaseEnd = function() {
  this.$$phase = null;
};



//--------------AsyncQueue, PostDigest-------------------------
Scope.prototype.$asyncQueue = function (expression) {
	var that = this;
	if ((!that.$$phase) && (!that.$$asyncQueue.length)) {
		setTimeout(function() {
			if (that.$$asyncQueue.length) {
				that.$digest();
			}
		}, 0);
	}
	that.$$asyncQueue.push({
		scope : this,
		expression : expression
	});
};


Scope.prototype.$postDigest = function(func) {
	this.$$postDigests.push(func);
}








var scope = new Scope();
scope.a = 0;
scope.b = 0;
scope.c = 0;
scope.counter = 0;
console.log(scope.counter);
/*scope.$watchGroup([scope.a,scope.b,scope.c],function(currentValue,prevValue,scope){scope.counter ++;});*/
scope.$digest();
console.log(scope.counter);
var unWatchWatchGroup = scope.$watchGroup([function(scope){return scope.a;},function(scope){return scope.b;},function(scope){return scope.c;}],
	function(currentValue,prevValue,scope){scope.counter ++;});
scope.$digest();
console.log(scope.counter);

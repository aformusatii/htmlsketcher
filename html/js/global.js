var GRID = 5;
var CSS_SELECTED = 'selected';
var CSS_WRAPPER = '.wrapper';
var WRAPPER_PADDING = 2;

var ctrlPressed = false;

var stopEvent = function (e) {
	e.stopPropagation();
	e.preventDefault()
	e.stopImmediatePropagation();
};

function UtilsClass() {
	
	this.executeWithDelay = function (params) {
		if (params.context.prevJob) {
			window.clearTimeout(params.context.prevJob);
		}
		
		params.context.prevJob = setTimeout(function () {
								    params.jobToExecute(params.params);	
							     }, params.timeout);
	};
	
	this.iterate = function (arrayToIterate, _handler) {
	    for (var i =0; i < arrayToIterate.length; i++) {
	        _handler(arrayToIterate[i]);
	    }
	};
	
};

var Utils = new UtilsClass();

function between(x, min, max) {
	return x >= min && x <= max;
}
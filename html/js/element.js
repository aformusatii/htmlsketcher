function ElementManager() {
	
	var elements = {};
	
	var maxId = 0;
	
	var copyBuffer = new Array();
	
	var _em = this;
	
	this.init = function () {
		$(CSS_WRAPPER).each(function () {
		    var $elem = $(this);
			_em.registerElement($elem);
		});
	}
	
	this.registerElement = function ($elem) {
		_em.registerOrRefresh($elem);
		wrapperManager.hookWrapper($elem);
		
		var id = parseInt($elem.attr('id').substring(1));
		if (id >= maxId) {
		    maxId = id + 1;
		}
	};
	
	this.registerOrRefresh = function ($elem) {
		var id = $elem.attr('id');
		var offset = $elem.offset();
		elements[id] = {
			x1: offset.left,
			y1: offset.top,
			x2: offset.left + $elem.width(),
			y2: offset.top + $elem.height(),
		};
	};
	
	this.getElements = function () {
		return elements;
	};
	
	this.copy = function () {
	    wrapperManager.iterateWrappers(function (wrapper) {
	    	var $elem = wrapper.getElem();
	    	copyBuffer.push($elem);
	    });
	};
	
	this.paste = function (evt) {
	    // Deselecct all previous seleccted elements we are going to select the ones we clone
	    wrapperManager.deselectAllWrappers();
	    
	    Utils.iterate(copyBuffer, function ($elem) {
	        // clone element
	        var $newElem = $elem.clone();
	        
	        // change wrapper unique identifier
	        $newElem.attr('id', 'E' + maxId++);
	        
	        // change offset to see new elements
	        var offset = $newElem.offset();
	        $newElem.offset({
	            top: offset.top + 2,
	            left: offset.left + 2
	        });
	        
	        // Register New Element
	        _em.registerElement($newElem);
	        
	        // Append to main container
	        $('#main').append($newElem);
	        
	        // Select the new element
        	wrapperManager.select({
    			event: evt,
    			$elem: $newElem,
    			deselect: false,
    			callMousedown: false
    		});
	        
	    });
	    
	    // Clear copy buffer
	    copyBuffer = new Array();
	};
	
};

var elementManager = new ElementManager();
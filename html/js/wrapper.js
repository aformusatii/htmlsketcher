/***********************************************************
 * 
 * Util Types
 * 
 ***********************************************************/
var MTypes = {
	MOVE:                {id: 1, cursor: 'move',   },
	RESIZE_LEFT:         {id: 2, cursor: 'w-resize'},
	RESIZE_RIGHT:        {id: 3, cursor: 'e-resize'},
	RESIZE_TOP:          {id: 4, cursor: 'n-resize'},
	RESIZE_BOTTOM:       {id: 5, cursor: 's-resize'},
	RESIZE_TOP_LEFT:     {id: 6, cursor: 'nw-resize'},
	RESIZE_TOP_RIGHT:    {id: 7, cursor: 'ne-resize'},
	RESIZE_BOTTOM_LEFT:  {id: 8, cursor: 'sw-resize'},
	RESIZE_BOTTOM_RIGHT: {id: 9, cursor: 'se-resize'}
};

var GridUtil = {
	snap: function (value) {
		return (Math.round(value / GRID) * GRID);
	}
};

var MouseUtil = {type: MTypes.MOVE};

MouseUtil.check = function (mtypes) {
	for (var i = 0; i < mtypes.length; i++) {
		if (MouseUtil.type.id === mtypes[i].id) {
			return true;
		}
	}
	
	return false;
};

/***********************************************************
 * 
 * Wrapper Class
 * 
 ***********************************************************/
function Wrapper($elem) {
	
	var draggable = false;
	
	var _w = this;
	
	this.id = $elem.attr('id');
	
	this.historySnapshot = {};
	
	var initialOffset = {
		top:  0,
		left: 0
	};

	var mouse = {
		initialPosition: {
			x: 0,
			y: 0
		}
	};
	
	var child = {
		$elem: $(),
		
		initialDimension: {
			height: 0,
			width: 0
		}
	};
	
	this.mousemove = function (e) {
		
		// while draggin or resizing don't recalculate mouse type
		if (draggable) {
			return;
		}
		
		var offset = $elem.offset();
		
		var relX = e.pageX - offset.left;
		var relY = e.pageY - offset.top;
		
		var elemHeight = $elem.height() + WRAPPER_PADDING * 2;
		var elemWidth = $elem.width() + WRAPPER_PADDING * 2;
		
		var topDelta = (relY >= 0) && (relY <= WRAPPER_PADDING);
		var bottomDelta = (relY <= elemHeight) && (relY >= (elemHeight - WRAPPER_PADDING - 1));
		
		var leftDelta = (relX >= 0) && (relX <= WRAPPER_PADDING);
		var rightDelta = (relX <= elemWidth) && (relX >= (elemWidth - WRAPPER_PADDING - 1));
		
		if (topDelta) {
			if (leftDelta) {
				MouseUtil.type = MTypes.RESIZE_TOP_LEFT;
			} else if (rightDelta) {
				MouseUtil.type = MTypes.RESIZE_TOP_RIGHT;
			} else {
				MouseUtil.type = MTypes.RESIZE_TOP;
			}

		} else if (bottomDelta) {
			if (leftDelta) {
				MouseUtil.type = MTypes.RESIZE_BOTTOM_LEFT;
			} else if (rightDelta) {
				MouseUtil.type = MTypes.RESIZE_BOTTOM_RIGHT;
			} else {
				MouseUtil.type = MTypes.RESIZE_BOTTOM;
			}
			
		} else if (leftDelta) {
			MouseUtil.type = MTypes.RESIZE_LEFT;
		} else if (rightDelta) {
			MouseUtil.type = MTypes.RESIZE_RIGHT;
		} else {
			MouseUtil.type = MTypes.MOVE;
		}

		$elem.css('cursor', MouseUtil.type.cursor);
		
		e.stopPropagation();
	};
	
	this.resizeOrMove = function (e) {
		
		if (!draggable) {
			return;
		}
			
		var $child = child.$elem;
		
		var startX = mouse.initialPosition.x;
		var startY = mouse.initialPosition.y;

		var deltaX = mouse.initialPosition.x - initialOffset.left;
		var deltaY = mouse.initialPosition.y - initialOffset.top;
		
		var initialDimension = child.initialDimension;
		
		if (MouseUtil.check([MTypes.MOVE])) {
			
			$elem.offset({
				left: GridUtil.snap(e.pageX - deltaX),
				top: GridUtil.snap(e.pageY - deltaY)
			});
			
		}
		
		if (MouseUtil.check([MTypes.RESIZE_TOP, 
		             	     MTypes.RESIZE_TOP_LEFT, 
		             	     MTypes.RESIZE_TOP_RIGHT])) {
			
			var moveDeltaY = GridUtil.snap(startY - e.pageY);
			
			var height = initialDimension.height + moveDeltaY;
			
			if (height > -1) {
				$child.height(height);
									
				$elem.offset({
					top: initialOffset.top - moveDeltaY
				});
			}
			
		}
		
		if (MouseUtil.check([MTypes.RESIZE_BOTTOM, 
		             	     MTypes.RESIZE_BOTTOM_LEFT, 
		                     MTypes.RESIZE_BOTTOM_RIGHT])) {
			
			var moveDeltaY = GridUtil.snap(e.pageY - startY);
			$child.height(initialDimension.height + moveDeltaY);
			
		}
		
		if (MouseUtil.check([MTypes.RESIZE_LEFT, 
		             	     MTypes.RESIZE_TOP_LEFT, 
		             	     MTypes.RESIZE_BOTTOM_LEFT])) {
			
			var moveDeltaX = GridUtil.snap(startX - e.pageX);
			
			var width = initialDimension.width + moveDeltaX;
			
			if (width > -1) {
				$child.width(width);
									
				$elem.offset({
					left: initialOffset.left - moveDeltaX
				});
			}
		}
		
		if (MouseUtil.check([MTypes.RESIZE_RIGHT, 
		                     MTypes.RESIZE_TOP_RIGHT, 
		                     MTypes.RESIZE_BOTTOM_RIGHT])) {
			
			var moveDeltaX = GridUtil.snap(e.pageX - startX);
			$child.width(initialDimension.width + moveDeltaX);
			
		}
		
		_w.changedNotification();

	};
	
	this.select = function(e) {
		
		if (!$elem.hasClass(CSS_SELECTED)) {
			
			$elem.addClass(CSS_SELECTED);
			
			var offset = $elem.offset();
			
			$elem.offset({
				top: offset.top - WRAPPER_PADDING,
				left: offset.left - WRAPPER_PADDING
			});
			
			$elem.bind('mousemove.wrapper', function (e) {
				_w.mousemove(e);
			}).trigger('mousemove', [e]);
		}

	};
	
	this.deselect = function (e) {
		
		if ($elem.hasClass(CSS_SELECTED)) {
			
			$elem.removeClass(CSS_SELECTED);
			
			var offset = $elem.offset();
			
			$elem.offset({
				top: offset.top + WRAPPER_PADDING,
				left: offset.left + WRAPPER_PADDING
			});
			
			$elem.unbind('mousemove.wrapper').css('cursor', 'default');		
		}
	};
	
	this.mousedown = function (e) {
		
		draggable = true;
		
		initialOffset = $elem.offset();	
		
		mouse.initialPosition.x = e.pageX;
		mouse.initialPosition.y = e.pageY;
		
		var c = $elem.children().first();
		child.$elem = c;
		
		var d = child.initialDimension;
		d.height = c.height();
		d.width = c.width();
		
		// Create a new history snapshot
		_w.historySnapshot = {
			changed: false,
			properties: [
			             
			    // Remember offset
				{
					$elem: $elem,
					oldValue: initialOffset,
					revert: function (oldState) {
						if (oldState.$elem.hasClass(CSS_SELECTED)) {
							oldState.$elem.offset(oldState.oldValue);
						} else {
							oldState.$elem.offset({
								top: oldState.oldValue.top + WRAPPER_PADDING,
								left: oldState.oldValue.left + WRAPPER_PADDING,
							});
						}
					}
				},
				
				// Remember height
				{
					$elem: c,
					oldValue: c.height(),
					revert: function (oldState) {
						oldState.$elem.height(oldState.oldValue);
					}
				},
				
				// Remember width
				{
					$elem: c,
					oldValue: c.width(),
					revert: function (oldState) {
						oldState.$elem.width(oldState.oldValue);
					}
				}
			],
			reverted: function () {
				elementManager.registerOrRefresh($elem);
			}
		};		
		
	};
	
	this.mouseup = function (e) {
		draggable = false;
	};
	
	this.changedNotification = function () {
		_w.historySnapshot.changed = true;
		
		elementManager.registerOrRefresh($elem);
	}
	
	this.getElem = function () {
	    return $elem;
	};
}

/***********************************************************
 * 
 * Mouse selector class
 * 
 ***********************************************************/
function MouseSelector() {
	
	var $selector;
	var active = false;
	
	var mouseX = 0;
	var mouseY = 0;	
	
	var _this = this;
	
	this.init = function () {
		$selector = $('#mouseSelector');
	};
	
	this.mouseDown = function (e) {
		$selector.show();
		
		$selector.height(0);
		$selector.width(0);
		$selector.offset({
			top: e.pageY,
			left: e.pageX
		});
		
		mouseX = e.pageX;
		mouseY = e.pageY;
		
		active = true;
	};
	
	this.mouseUp = function (e) {
		$selector.hide();
		active = false;
	};
	
	this.mouseMove = function (e) {
		if (active) {
			var deltaX = Math.abs(mouseX - e.pageX);
			var deltaY = Math.abs(mouseY - e.pageY);
			
			$selector.height(deltaY);
			$selector.width(deltaX);
			$selector.offset({
				top: e.pageY - ((e.pageY > mouseY) ? deltaY : 0),
				left: e.pageX - ((e.pageX > mouseX) ? deltaX : 0)
			});
			
			Utils.executeWithDelay({
				jobToExecute: _this.select,
				params: {
					event: e,
					x1: ((e.pageX <= mouseX) ? e.pageX : mouseX),
					y1: ((e.pageY <= mouseY) ? e.pageY : mouseY),
					x2: ((e.pageX > mouseX) ? e.pageX : mouseX),
					y2: ((e.pageY > mouseY) ? e.pageY : mouseY)
				},
				timeout: 200,
				context: _this
			});
		}
	};
	
	this.select = function (params) {
		
        var _x1 = params.x1;
        var _y1 = params.y1;
        var _x2 = params.x2;
        var _y2 = params.y2;
        
        var elements = elementManager.getElements();
		
	    for (var id in elements) {
	        if (!elements.hasOwnProperty(id)) {
	            continue;
	        }
	        
	        var elem = elements[id];
	        
	        var x1 = elem.x1;
	        var y1 = elem.y1;
	        var x2 = elem.x2;
	        var y2 = elem.y2;
	        
	        if ((between(x1, _x1, _x2) || between(x2, _x1, _x2))
	         && (between(y1, _y1, _y2) || between(y2, _y1, _y2))) {
	        	
	        	var $elem = $('#' + id);
	        	
	        	wrapperManager.select({
	    			event: params.event,
	    			$elem: $elem,
	    			deselect: false,
	    			callMousedown: false
	    		});
	        }
	    }
	};
	
	this.isActive = function() {
		return active;
	}
	
};

var mouseSelector = new MouseSelector();

/***********************************************************
 * 
 * Wrapper Manager
 * 
 ***********************************************************/
function WrapperManager() {
	
	var wrappers = {};
	
	var _this = this;

	this.iterateWrappers = function (process) {
	    for (var id in wrappers) {
	        if (!wrappers.hasOwnProperty(id)) {
	            continue;
	        }
	        
	        var wrapper = wrappers[id];
	        
	        process(wrapper);
	    }	
	};

	this.deselectAllWrappers = function (e) {
		_this.iterateWrappers(function (wrapper) {
	    		wrapper.deselect(e);
	    	});
		
		wrappers = {};	
	};
	
	this.init = function () {
		// Init Mouse Handlers
		$(document).bind('mousemove', _this.mouseMoveOnDocument)
		           .bind('mousedown', _this.mouseDownOnDocument)
		           .bind('mouseup', _this.mouseUpOnDocument);
	};
	
	this.hookWrapper = function ($elem) {
	    $elem.bind('mousedown', _this.mouseDownOnWrapper);
	};
		
	this.mouseDownOnWrapper = function (e) {
		
		var $elem = $(this);

		_this.select({
			event: e,
			$elem: $elem,
			deselect: !ctrlPressed,
			callMousedown: true
		});
			
	        // Prevent propagation of current event to document
	        stopEvent(e);
		
	};
	
	this.mouseDownOnDocument = function (e) {
		if (!ctrlPressed) {
			_this.deselectAllWrappers(e);
		}
		
		mouseSelector.mouseDown(e);
			
	        stopEvent(e);
	};
	
	this.mouseUpOnDocument = function (e) {
		
        _this.iterateWrappers(function (wrapper) {
        	wrapper.mouseup(e);
        });
        
        mouseSelector.mouseUp(e);
	};
	
	this.mouseMoveOnDocument = function (e) {
		
        _this.iterateWrappers(function (wrapper) {
        	wrapper.resizeOrMove(e);
        });
        
        mouseSelector.mouseMove(e);
	};
	
	this.select = function (params) {
		
		var id = params.$elem.attr('id');
		var wrapper;
		
		if (id in wrappers) {
			// Get wrapper for current selected element if it was already selected
			wrapper = wrappers[id];

		} else {
			// Deselect previous wrappers
			if (params.deselect) {
				_this.deselectAllWrappers(params.event);
			}
			
			// Create new wrapper for this element which was selected
			wrapper = new Wrapper(params.$elem);
			wrappers[id] = wrapper;
		}
		
		// History linked states
		var historyGroup = new Array();
		
	        _this.iterateWrappers(function (wrapper) {
	        	
	        	// Select element
	        	wrapper.select(params.event);
	        	
	        	// Notify each wrapper about mouse down event
	        	if (params.callMousedown) {
	        		wrapper.mousedown(params.event);
	        	}
	        	
	        	// Push current wrapper state to common array
	        	historyGroup.push(wrapper.historySnapshot);
	        });
	        
	        // Remember linked states
	        editorHistory.remember(historyGroup);
	};
	
	this.getWrappers = function () {
	    return wrappers; 
	};
	
};

var wrapperManager = new WrapperManager();
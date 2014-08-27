var K_CTRL = 17;
var K_Z = 90;
var K_C = 67;
var K_V = 86;

/***********************************************************
 * 
 * Editor Object
 * 
 ***********************************************************/
var editor = (function () {
	
	this.init = function () {
		// Init Keyboard Hadlers
		$(window).keydown(function(evt) {
		    
			if (evt.which == K_CTRL) { // ctrl
				ctrlPressed = true;
			}
			
			if (ctrlPressed && evt.which == K_Z) { // ctrl + z
				editorHistory.rollback();
			}
			
			if (ctrlPressed && evt.which == K_C) { // ctrl + c
				elementManager.copy(evt);
			}
			
			if (ctrlPressed && evt.which == K_V) { // ctrl + v
				elementManager.paste(evt);
			}
			
			//console.log(evt.which);
		}).keyup(function(evt) {
			if (evt.which == K_CTRL) { // ctrl
				ctrlPressed = false;
			}
		});
		
	};
	
	return {
		init: init
	};
	
})();

$(function() {
	
	// Initialize editor
	editor.init();
	
	// Initialize mouse selector
	mouseSelector.init();
	
	// Initilize wrapper manager
	wrapperManager.init();
	
	// Initilize element manager
	elementManager.init();
});

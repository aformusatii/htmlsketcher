/***********************************************************
 * 
 * Editor History object (as the name suggests manages the history)
 * 
 ***********************************************************/
var editorHistory = (function () {
	
	var historyStack = new Array();
	
	this.remember = function (historyGroup) {
		historyStack.push(historyGroup);
	}
	
	this.rollback = function () {
		while (true) {
			var historyGroup = historyStack.pop();

			if (historyGroup) {
				
				var allUnchaged = true;
				
				// Revert all linked states
				$.each(historyGroup, function(index, value) {
					
					var historySnapshot = value;
					
					if (historySnapshot.changed) {
						
						// Iterate and revert all properties
						for (var i = 0; i < historySnapshot.properties.length; i++) {
							var state = historySnapshot.properties[i];
							
							state.revert(state);
							
							historySnapshot.changed = false;
						}

						allUnchaged = false;
						
						// Notify that the state was reverted
						historySnapshot.reverted();
					}
				});
				
				//console.log('History rollback -> ' + allUnchaged);
				
				if (allUnchaged){
					
					// if there were no changes continue with next history snapshot
					continue;
				} else {
					
					// One rollback at a time
					break;
				}

			} else {
				
				// No more history snapshots
				break;
			}
		}
	}
	
	return {
		remember: remember,
		rollback: rollback
	};
})();
/**
 * Created by Andrei on 27/08/2014.
 */
function UIWrapper($domElement) {

    var uiWrapper = this;

    // Initialize variables
    uiWrapper.draggable = false;
    uiWrapper.initialOffset = {top:  0, left: 0};
    uiWrapper.mouse = { initialPosition: {x: 0, y: 0} };
    uiWrapper.child = {$elem: $(), initialDimension: {height: 0, width: 0}};
    uiWrapper.offsetCoordinates = {x1: 0, y1: 0, x2: 0, y2: 0};
    uiWrapper.id = $domElement.attr('id');
    uiWrapper.historySnapshot = {};

    // Define UI Wrapper Functions
    uiWrapper.refreshPositionInfo = function () {
        var offset = $domElement.offset();
        uiWrapper.offsetCoordinates = {
            x1: offset.left,
            y1: offset.top,
            x2: offset.left + $domElement.width(),
            y2: offset.top + $domElement.height()
        };
    };

    uiWrapper.changedNotification = function () {
        uiWrapper.historySnapshot.changed = true;
        uiWrapper.refreshPositionInfo();
    };

    uiWrapper.getDOMElement = function () {
        return $domElement;
    };

    // Initialization
    uiWrapper.refreshPositionInfo();
}
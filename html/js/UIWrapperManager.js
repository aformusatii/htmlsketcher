/**
 * Created by Andrei on 27/08/2014.
 */

function UIWrapperManager() {

    var _this = this;
    var uiWrappers = {};

    _this.registerUIWrapper = function ($domElement) {
        var uiWrapper = new UIWrapper($domElement);
        uiWrappers[uiWrapper.id] = uiWrapper;
    };

    $(CSS_WRAPPER).each(function () {
        var $domElement = $(this);
        _this.registerUIWrapper($domElement);
    });

}

/**
 * Created by Andrei on 27/08/2014.
 */
function MouseHandler() {

    var _this = this;




    // Init Mouse Handlers
    $(document).bind('mousemove', _this.mouseMoveOnDocument)
               .bind('mousedown', _this.mouseDownOnDocument)
               .bind('mouseup',   _this.mouseUpOnDocument);

}
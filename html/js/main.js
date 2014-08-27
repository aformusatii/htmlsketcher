$(function () {
	$(document)
		.bind('mousemove', WrapperManager.mouseMoveOnDocument)
		.bind('mousedown', WrapperManager.mouseDownOnDocument)
		.bind('mouseup',   WrapperManager.mouseUpOnDocument);

	$(CSS_WRAPPER).bind('mousedown', WrapperManager.mouseDownOnWrapper);
});
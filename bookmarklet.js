var HTML5Outline = require("h5o"),
	cssify = require("cssify"),
	bookmarkletCss = require("./bookmarklet.css"),
	Iframeish = require("iframeish");

var setAttribute = function (els, attr, val) {
	for (var i = 0; i < els.length; i++) {
		els[i].setAttribute(attr, val);
	}
};

var IFRAME_BORDER_SIZE = 2;
var IFRAME_POSITION = 10;
var IFRAME_PADDING = 15;
var IFRAME_STYLE = '' +
	'position:fixed;' +
	'top:' + IFRAME_POSITION + 'px;' +
	'right:' + IFRAME_POSITION + 'px;' +
	'border:' + IFRAME_BORDER_SIZE + 'px solid #000;' +
	'background:rgba(255,255,255,.9);' +
	'z-index:999999;' +
	'width:90%;' +
	'max-width:90%;' +
	'max-width:calc(100% - 20px);' +
	'min-height:50px;'+
	'padding: ' + IFRAME_PADDING + 'px 0 ' + IFRAME_PADDING + 'px ' + IFRAME_PADDING + 'px;';

var outlineHTML = HTML5Outline(document.body).asHTML(true);

var containerDiv = document.createElement('div');
setAttribute([containerDiv], "class", "h5o-container");
containerDiv.innerHTML = outlineHTML;

setAttribute(containerDiv.getElementsByTagName('a'), "target", "_top");

var lnk = containerDiv.insertBefore(document.createElement('button'), containerDiv.firstChild);
setAttribute([lnk], "class", "h5o-close");
lnk.innerHTML = "Close";

Iframeish(function (err, iframeish) {
	if (err) {
		console.error(err);
		return;
	}

	cssify(bookmarkletCss, iframeish.document);
	setAttribute([iframeish.iframe], "style", IFRAME_STYLE);
	iframeish.document.body.appendChild(containerDiv);

	containerDiv.style.position = "absolute"; // shrink in width

	// Prevent displaying content past the browser window's vertical limit
	var verticalClearance = IFRAME_PADDING + IFRAME_BORDER_SIZE + IFRAME_POSITION;
	var availableWindowHeight = window.innerHeight - verticalClearance;
	var containerDivHeight = containerDiv.scrollHeight + verticalClearance + 10;
	if (containerDivHeight > availableWindowHeight)
		containerDivHeight = availableWindowHeight;

	iframeish.iframe.style.width = (containerDiv.scrollWidth + IFRAME_BORDER_SIZE) + "px";
	iframeish.iframe.style.height = containerDivHeight + "px";
	containerDiv.style.position = "static"; // restore width

	lnk.addEventListener("click", function () {
		document.body.removeChild(iframeish.iframe);
		containerDiv = lnk = null;
	});
});

var HTML5Outline = require("h5o"),
	cssify = require("cssify"),
	bookmarkletCss = require("./bookmarklet.css"),
	Iframeish = require("./Iframeish");

var setAttribute = function (els, attr, val) {
	for (var i = 0; i < els.length; i++) {
		els[i].setAttribute(attr, val);
	}
};

var IFRAME_BORDER_SIZE = 2;
var IFRAME_STYLE = '' +
	'position:fixed;' +
	'top:10px;' +
	'right:10px;' +
	'border:' + IFRAME_BORDER_SIZE + 'px solid #000;' +
	'background:rgba(255,255,255,.9);' +
	'z-index:999999;' +
	'width:90%;' +
	'max-width:90%;' +
	'max-width:calc(100% - 20px);' +
	'min-height:50px;';

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
	iframeish.iframe.style.width = (containerDiv.scrollWidth + IFRAME_BORDER_SIZE) + "px";
	iframeish.iframe.style.height = (containerDiv.scrollHeight + IFRAME_BORDER_SIZE) + "px";
	containerDiv.style.position = "static"; // restore width

	lnk.addEventListener("click", function () {
		document.body.removeChild(iframeish.iframe);
		containerDiv = lnk = null;
	});
});

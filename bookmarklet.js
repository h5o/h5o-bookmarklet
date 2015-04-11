var HTML5Outline = require("h5o"),
	cssify = require("cssify"),
	bookmarkletCss = require("./bookmarklet.css"),
	Iframeish = require("./Iframeish");

var setAttribute = function (els, attr, val) {
	for (var i = 0; i < els.length; i++) els[i].setAttribute(attr, val);
};

var IFRAME_STYLE = 'position:fixed;top:10px;right:10px;border:2px solid #000;background:rgba(255,255,255,.9);z-index:999999;width:400px;';

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

	var size = containerDiv.getBoundingClientRect();
	iframeish.iframe.style.height = (size.height > 400 ? 400 : size.height) + "px";

	lnk.addEventListener("click", function () {
		document.body.removeChild(iframeish.iframe);
		containerDiv = lnk = null;
	});
});

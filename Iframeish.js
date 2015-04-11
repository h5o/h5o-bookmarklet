// @todo: publish on npm?
function Iframeish(opts, cb) {
	if (typeof(cb) === "undefined" && typeof(opts) === "function") {
		cb = opts;
		opts = {};
	}
	var renderTo = opts.renderTo || document.body;

	var iframe = document.createElement("iframe");
	iframe.style.border = "none";

	var loaded = false;
	var onLoad = function () {
		if (loaded) {
			return;
		}

		var doc = iframe.contentDocument;
		try {
			doc.open(); // IE might fail even after `load` has fired
		} catch (e) {
			setTimeout(onLoad, 10);
			return;
		}
		loaded = true;
		// you can only document.write the doctype...
		doc.write("<!doctype html>");
		doc.close();

		cb(null, {iframe: iframe, document: doc});
	};

	iframe.addEventListener("load", onLoad);

	renderTo.appendChild(iframe);
}

module.exports = Iframeish;

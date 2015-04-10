module.exports = function (grunt) {

	require("time-grunt")(grunt);
	require("load-grunt-tasks")(grunt);

	var VERSION = require("./package.json").version;

	grunt.initConfig({
		"clean": {
			"all": ["dist/**"]
		},
		"uglify": {
			"bookmarklet-js": {
				"src": ["dist/debug/bookmarklet.debug.js"],
				"dest": "dist/debug/bookmarklet.min.js"
			}
		},
		"gh-pages": {
			"options": {
				base: "dist",
				add: true,
				repo: "https://" + process.env.GH_TOKEN + "@github.com/h5o/h5o.github.io.git",
				branch: "master"
			},
			"src": "bookmarklet.html"
		},
		browserify: {
			"bookmarklet-js": {
				"src": [
					"bookmarklet.js"
				],
				"dest": "dist/debug/bookmarklet.debug.js"
			}
		},
		"bump": {
			"options": {
				commitMessage: 'release %VERSION%',
				commitFiles: [ "-a" ],
				tagName: '%VERSION%',
				tagMessage: 'version %VERSION%',
				pushTo: 'origin'
			}
		}
	});

	grunt.registerTask("default", ["clean:all", "browserify", "uglify", "_bookmarklet-release"]);

	grunt.registerTask("release", function () {
		var bump = grunt.option("bump");
		if (bump != "patch" && bump != "minor" && bump != "major") grunt.fail.fatal("Please pass --bump");
		grunt.task.run(["checkbranch:master", "checkpending", "bump:" + bump]);
	});

	grunt.registerTask("_bookmarklet-release", "Prepare bookmarklet HTML for release", function () {
		var done = this.async();
		var fs = require("fs"),
			ejs = require("ejs");

		ejs.renderFile("bookmarklet.html.ejs", {

			version: VERSION,
			bookmarklet: encodeURIComponent(fs.readFileSync("dist/debug/bookmarklet.debug.js").toString())

		}, function (err, bookmarklet) {
			if (err) grunt.fail.fatal(err);
			fs.writeFile("dist/bookmarklet.html", bookmarklet, done);
		});
	});

};

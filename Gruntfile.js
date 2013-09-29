module.exports = function(grunt) {
	grunt.initConfig({
		sass: {
			dist: {
				files: {
					'css/cruisemonkey/cruisemonkey.css': 'sass/cruisemonkey/cruisemonkey.scss'
				}
			},
			dev: {
				files: {
					'css/cruisemonkey/cruisemonkey.css': 'sass/cruisemonkey/cruisemonkey.scss'
				}
			}
		},
		manifest: {
			generate: {
				options: {
					basePath: './',
					timestamp: false,
					hash: true,
					master: [
						'index.html',
						'partials/deck-plans.html',
						'partials/event-list.html',
						'partials/login.html'
					],
					exclude: ['Gruntfile.js', 'webserver.js', 'package.json', '.gitignore', '.git']
				},
				dest: 'cruisemonkey.manifest',
				src: [
					'*.ico',
					'*.png',
					'css/*.css',
					'css/3rdparty/*.css',
					'css/foundation/*.css',
					'css/cruisemonkey/*.css',
					'fonts/*.otf',
					'fonts/*.ttf',
					'fonts/*.svg',
					'img/*.svg',
					'js/3rdparty/*.js',
					'js/angular/*.js',
					'js/bootstrap/*.js',
					'js/foundation/*.js',
					'js/log4javascript/*.js',
					'js/cruisemonkey/*.js',
					'index.html',
					'partials/deck-plans.html',
					'partials/event-list.html',
					'partials/login.html'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-manifest');
	grunt.registerTask('default', ['sass', 'manifest']);
};


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
					'css/*/*.css',
					'fonts/*.otf',
					'fonts/*.ttf',
					'fonts/*.svg',
					'img/*.svg',
					'icons/*.png',
					'icons/*/*.png',
					'js/*/*.js',
					'index.html',
					'partials/*.html'
				]
			}
		},
		watch: {
			css: {
				files: ['sass/*/*.scss'],
				tasks: ['sass', 'manifest'],
				options: {
					interval: 500,
					spawn: false,
					debounceDelay: 250,
					atBegin: true
				}
			},
			manifest: {
				files: [
					'*.ico',
					'*.png',
					'css/*.css',
					'css/*/*.css',
					'fonts/*.otf',
					'fonts/*.ttf',
					'fonts/*.svg',
					'img/*.svg',
					'icons/*.png',
					'icons/*/*.png',
					'js/*/*.js',
					'index.html',
					'partials/*.html'
				],
				tasks: ['manifest'],
				options: {
					interval: 500,
					spawn: false,
					debounceDelay: 250,
					atBegin: true
				}
			}
		},
	    jasmine: {
	        test: {
	            src: [
					'js/3rdparty/custom.modernizr.js',
					'js/log4javascript/log4javascript_uncompressed.js',
					'js/3rdparty/jquery.js',
					'js/3rdparty/script.js',
					'js/3rdparty/fastclick.js',
					'js/3rdparty/hammer.min.js',
					'js/3rdparty/pouchdb-nightly.js',
					'js/angular/angular.js',
					'js/angular/angular-phonegap-ready.js',
					'js/angular/angular-resource.js',
					'js/angular/angular.strap.min.js',
					'js/angular/angular-hammer.js',
					'js/angular/angular-mocks.js',
					'js/3rdparty/jasmine.async.js',
					'js/cruisemonkey/*.js'
				],
	            options: {
					keepRunner: true,
	                specs: ['test/*.js']
	            }
	        }
	    }
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-manifest');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.registerTask('default', ['sass', 'manifest', 'jasmine']);
};


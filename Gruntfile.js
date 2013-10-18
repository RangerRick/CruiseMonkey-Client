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
					'js/*.js',
					'js/*/*.js',
					'index.html',
					'partials/*.html'
				]
			}
		},
		connect: {
			local: {
				options: {
					hostname: '*',
					port: 8080,
					debug: true
				}
			}
		},
		uglify: {
			cruisemonkey: {
				files: {
					'js/cruisemonkey.min.js': [
						'js/cruisemonkey/string.js',
						'js/cruisemonkey/Config.js',
						'js/cruisemonkey/Controller.Login.js',
						'js/cruisemonkey/Database.js',
						'js/cruisemonkey/Events.js',
						'js/cruisemonkey/Logging.js',
						'js/cruisemonkey/Navigation.js',
						'js/cruisemonkey/User.js',
						'js/cruisemonkey/controllers.js',
						'js/cruisemonkey/directives.js',
						'js/cruisemonkey/filters.js',
						'js/cruisemonkey/services.js',
						'js/cruisemonkey/main.js'
					]
				}
			}
		},
		jshint: {
			options: {
				force: true
			},
			uses_defaults: [ 'js/cruisemonkey/*.js' ]
		},
		jasmine: {
			test: {
				src: [
					'js/3rdparty/custom.modernizr.js',
					'js/log4javascript/log4javascript.js',
					'js/3rdparty/script.js',
					'js/3rdparty/hammer.min.js',
					'js/3rdparty/pouchdb-nightly.js',
					'js/angular/angular.js',
					'js/angular/angular-phonegap-ready.js',
					'js/angular/angular-interval.js',
					'js/angular/angular-route.js',
					'js/angular/angular-resource.js',
					'js/angular/angular-touch.js',
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
			cruisemonkey: {
				files: [
					'js/cruisemonkey/*.js'
				],
				tasks: ['uglify'],
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
					'js/*.js',
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
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-manifest');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['connect', 'watch']);
};


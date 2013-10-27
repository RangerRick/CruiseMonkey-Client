var cmfiles = [
	'js/cruisemonkey/string.js',
	'js/cruisemonkey/Config.js',
	'js/cruisemonkey/Controller.About.js',
	'js/cruisemonkey/Controller.DeckList.js',
	'js/cruisemonkey/Controller.Events.js',
	'js/cruisemonkey/Controller.Header.js',
	'js/cruisemonkey/Controller.Login.js',
	'js/cruisemonkey/Controller.Logout.js',
	'js/cruisemonkey/Controller.Navigation.js',
	'js/cruisemonkey/Database.js',
	'js/cruisemonkey/Events.js',
	'js/cruisemonkey/Logging.js',
	'js/cruisemonkey/User.js',
	'js/cruisemonkey/directives.js',
	'js/cruisemonkey/filters.js',
	'js/cruisemonkey/services.js',
	'js/cruisemonkey/main.js'
];  

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
						'template/about.html',
						'template/deck-plans.html',
						'template/event-list.html',
						'template/logout.html',
						'template/login.html'
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
					'bower_components/log4javascript/log4javascript*.js',
					'bower_components/angular/angular*',
					'bower_components/angular-loader/angular-loader*',
					'bower_components/angular-route/angular-route*',
					'index.html',
					'template/*.html',
					'template/**/*.html'
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
					'js/cruisemonkey.min.js': cmfiles
				}
			}
		},
		concat: {
			cruisemonkey: {
				src: cmfiles,
				dest: 'js/cruisemonkey.js'
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
					'bower_components/jasmine.async/lib/jasmine.async.min.js',
					'js/3rdparty/custom.modernizr.js',
					'bower_components/log4javascript/log4javascript.js',
					'bower_components/hammerjs/dist/hammer.js',
					'bower_components/momentjs/moment.js',
					'js/3rdparty/pouchdb-nightly.js',
					'bower_components/angular/angular.js',
					'bower_components/angular-loader/angular-loader.js',
					'bower_components/angular-route/angular-route.js',
					'bower_components/angular-resource/angular-resource.js',
					'bower_components/angular-mocks/angular-mocks.js',
					'bower_components/angular-phonegap-ready/ready.js',
					'bower_components/angular-localstorage/angular-local-storage.js',
					'js/angular-3rdparty/angular-interval.js',
					'js/angular-3rdparty/angular-hammer.js',
					'js/angular-3rdparty/ui-bootstrap-0.6.0.js',
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
					'template/*.html',
					'tempate/**/*.html',
					'bower_components/**/*'
				],
				tasks: ['concat', 'uglify', 'manifest'],
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
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['connect', 'watch']);
};


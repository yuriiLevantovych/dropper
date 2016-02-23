module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            jsdropfull: {
                src: [
                    'src/jquery.dropper.js',
                    'src/methods/*.js'
                ],
                dest: 'dist/jquery.dropper.full.js'
            }
        },
        uglify: {
            main: {
                src: 'src/jquery.dropper.js',
                dest: 'dist/jquery.dropper.min.js'
            },
            jsdropfull: {
                src: 'dist/jquery.dropper.full.js',
                dest: 'dist/jquery.dropper.full.min.js'
            },
            methods: {
                files: [{
                    expand: true,
                    cwd: 'src/methods',
                    src: ['**/*.js'],
                    dest: 'dist/methods',
                    ext: '.min.js'
                }]
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/images/'
                }]
            }
        },
        sass: {
            dist: {
                options: {
                    sourcemap: 'none'
                },
                files: {
                    'dist/styles/default.css': 'src/styles/default.scss'
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/methods/*.js', 'src/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            styles: {
                files: ['src/styles/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'sass', 'uglify', 'imagemin', 'watch']);
};
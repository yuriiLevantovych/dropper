module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["dist"],

        concat: {
            jsdropfull: {
                src: [
                    'src/jquery.dropper.js',
                    'src/methods/*.js'
                ],
                dest: 'dist/jquery.drop.full.js'
            },
            jsfull: {
                src: [
                    'bower_components/jquery-mousewheel/jquery.mousewheel.min.js',
                    'bower_components/jscrollpane/script/jquery.jscrollpane.min.js',
                    'dist/jquery.drop.full.js'
                ],
                dest: 'dist/full.js'
            }
        },
        uglify: {
            main: {
                src: 'src/jquery.dropper.js',
                dest: 'dist/jquery.dropper.min.js'
            },
            jsdropfull: {
                src: 'dist/jquery.drop.full.js',
                dest: 'dist/jquery.drop.full.min.js'
            },
            jsfull: {
                src: 'dist/full.js',
                dest: 'dist/full.min.js'
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
        copy: {
            main: {
                expand: true,
                cwd: 'src/styles',
                src: '**',
                dest: 'dist/styles'
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['clean', 'concat', 'uglify'],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['clean', 'concat', 'copy', 'uglify', 'imagemin', 'watch']);
};
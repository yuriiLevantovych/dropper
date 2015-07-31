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
            },
            jsfull: {
                src: [
                    'bower_components/jquery-mousewheel/jquery.mousewheel.min.js',
                    'bower_components/jscrollpane/script/jquery.jscrollpane.min.js',
                    'dist/jquery.dropper.full.js'
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
                src: 'dist/jquery.dropper.full.js',
                dest: 'dist/jquery.dropper.full.min.js'
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
        compass: {
            dist: {
                options: {
                    imagesDir: 'dist/images',
                    sassDir: 'src/styles/',
                    cssDir: 'dist/styles/'
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/methods/*.js', '*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            styles: {
                files: ['src/styles/*.scss'],
                tasks: ['compass'],
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
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'compass', 'uglify', 'imagemin', 'watch']);
};
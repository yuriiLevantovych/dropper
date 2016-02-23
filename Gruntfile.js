module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
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
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            default: {
                src: 'dist/styles/default.css'
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
                tasks: ['sass', 'autoprefixer'],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        }
    });
    grunt.registerTask('default', ['concat', 'sass', 'autoprefixer', 'uglify', 'imagemin', 'watch']);
};
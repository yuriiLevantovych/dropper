module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["dist"],

        concat: {
            jsfull: {
                src: [
                    'bower_components/jquery-mousewheel/jquery.mousewheel.min.js',
                    'bower_components/jscrollpane/script/jquery.jscrollpane.min.js',
                    'src/jquery.dropper.js',
                    'src/methods/*.js'
                ],
                dest: 'dist/full.concat.js'
            }
        },
        uglify: {
            main: {
                src: 'src/jquery.dropper.js',
                dest: 'dist/jquery.dropper.min.js'
            },
            jsfull: {
                src: 'dist/full.concat.js',
                dest: 'dist/full.concat.min.js'
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
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/styles',
                    src: ['*.css'],
                    dest: 'dist/styles',
                    ext: '.min.css'
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
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'cssmin', 'imagemin']);
};
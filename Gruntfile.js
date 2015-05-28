module.exports = function (grunt) {

// 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["dist"],

        concat: {
            jsfull: {
                /*for general scripts*/
                src: [
                    'bower_components/jquery-mousewheel/jquery.mousewheel.min.js',
                    'bower_components/jscrollpane/script/jquery.jscrollpane.min.js',
                    'src/jquery.drop.js',
                    'src/methods/*.js'
                ],
                dest: 'dist/full.concat.js'
            },

        },
        uglify: {
            main: {
                src: 'src/jquery.drop.js',
                dest: 'dist/jquery.drop.min.js'
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
              src: ['*.css',],
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
    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'cssmin', 'imagemin']);
};
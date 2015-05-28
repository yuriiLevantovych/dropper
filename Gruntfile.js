module.exports = function (grunt) {

// 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            jsfull: {
                /*for general scripts*/
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/jquery-mousewheel/jquery.mousewheel.min.js',
                    'bower_components/jscrollpane/script/jquery.jscrollpane.min.js',
                    'drop/jquery.drop.js',
                    'drop/methods/*.js'
                ],
                dest: 'dest/full.concat.js'
            },

        },
        // sass: {
        //     dist: {
        //         /*for general style*/
        //         options: {
        //             style: 'compressed'
        //         },
        //         files: {
        //             'css/build/style.css': 'css/build/style.concat.css'
        //         }
        //     },
        //     dist2: {
        //         /*for styles separate pages*/
        //         options: {
        //             style: 'compressed'
        //         },
        //         files: [{
        //                 expand: true,
        //                 cwd: 'css/process/other/',
        //                 src: ['*.css'],
        //                 dest: 'css/build/other'
        //             }]
        //     }
        //     /*for styles separate pages*/
        // },
        uglify: {
            jsfull: {
                src: 'dest/full.concat.js',
                dest: 'dest/full.concat.min.js'
            },
            // dist3: {
            //     files: [{
            //             expand: true,
            //             cwd: 'js/process/plugins/',
            //             src: ['*.js'],
            //             dest: 'js/build/plugins/'
            //         }]
            // }
        }
    });
    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify']);
};
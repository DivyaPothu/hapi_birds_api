var path = require('path');
var webpack = require("webpack");
var nodeExternals = require('webpack-node-externals');

module.exports = function (grunt) {

    var env = grunt.option('env') || 'dev';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['./dist']
        },


        watch: {
            webpack: {
                files: ['./src/**/*.js'],
                tasks: ['webpack'],
                options: {
                    spawn: false,
                },
            }

        },

        // webpack

        webpack: {

            build: {
               // target: 'node',
                entry: {
                    'main': ['./src/main.js']
                },
                output: {
                    //path: path.resolve(__dirname, './dist'),
                    path: path.join(__dirname, "dist/"),
                    filename: '[name].js'

                },
                module: {
                    rules: [{
                        test: /\.js$/,
                        loader: 'babel-loader',
                        exclude: /node_modules/
                    }
                    ]
                },
                externals: [nodeExternals()],
                performance: {
                    hints: 'warning'
                },
                //devtool: 'source-map',
                devtool: '#source-map',
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({ minimize: true }),                    
                    new webpack.DefinePlugin({
                        'process.env': { NODE_ENV: JSON.stringify(env) }
                    }),
                    new webpack.LoaderOptionsPlugin({
                        minimize: true
                    })
                ]
            }, //end client


        }, // end webpack


    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webpack');

    // Default task(s).
    //grunt.registerTask('default', ['clean', 'uglify', 'requirejs:client', 'htmlmin', 'cssmin', 'imagemin']);
    grunt.registerTask('default', ['clean', 'webpack']);

};

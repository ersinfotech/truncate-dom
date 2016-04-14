var webpack = require('webpack');
var camelCase = require('camelcase');
var packageJSON = require('./package.json');

module.exports = {
	context: __dirname,
	entry: './index.js',
	output: {
		path: __dirname,
		filename: packageJSON.name + ".js",
		library: camelCase(packageJSON.name),
		libraryTarget: 'umd'
	},
	resolve: {
		fallback: __dirname
	},
}

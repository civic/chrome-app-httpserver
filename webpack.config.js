module.exports = {
	entry:{
		background: './background.js',
		window: './window.js'
	},
	output: {
		filename: "[name].bundle.js"
	},
	devtool: "inline-source-map"
};

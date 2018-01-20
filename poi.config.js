module.exports = {

	entry: {
		background: './src/background.js',
		settings: './src/settings.js',
		popup: './src/popup.js',
		'injection/downloadGrabber': './src/injection/grabbing/inject.js'
	},

	filename: {
		js: '[name].js',
		css: '[name].css'
	},

	dist: 'public',

	// Copy static HTML files on build
	copy: [
		{ from: './src/background.html', to: 'background.html' },
		{ from: './src/settings.html', to: 'settings.html' },
		{ from: './src/popup.html', to: 'popup.html' }
	],

	// Skip vendor code generation
	vendor: false,

	// Skip HTML generation
	html: false,

	// Force CSS extraction on non-production builds
	extractCSS: true,

	// Skip CSS autoprefixing
	autoprefixer: false,

	// Skip sourcemap generation
	sourceMap: false

};

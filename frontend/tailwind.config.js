module.exports = {
	purge: ['./index.html', './src/**/*.{js,jsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		container: {
			center: true,
		},
		extend: {
			colors: {
				brand: {
					blue: '#143645',
					orange: '#f47a60',
				},
			},
		},
		backgroundColor: (theme) => ({
			...theme('colors'),
			bg: '#e5ebff',
		}),
	},
	variants: {
		extend: {},
	},
	plugins: [],
};

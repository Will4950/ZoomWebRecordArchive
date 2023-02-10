module.exports = {
	env: {
		node: true
	},
	extends: ['eslint:recommended', 'plugin:prettier/recommended'],
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 'warn'
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	}
};

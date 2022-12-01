module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "semi": ["error", "never"],
    "space-before-blocks": ["error", "always"],
    "keyword-spacing": ["error", { "before": true }],
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "quotes": ["error", "single"],
    "arrow-parens": ["error", "always"],
    "prettier/prettier": [
			"error",
			{
				singleQuote: true,
				semi: false,
				tabWidth: 2,
				trailingComma: 'all',
				printWidth: 80,
			},
		],
  },
};

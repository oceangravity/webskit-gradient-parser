module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    "template-curly-spacing": "off",
    semi: [2, "never"],
    "indent": ["error", 2, {
      "SwitchCase": 1,
      "ignoredNodes": ["TemplateLiteral"]
    }]
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};


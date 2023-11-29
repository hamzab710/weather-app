module.exports = {
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": ["eslint:recommended", "prettier"],
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
    },
    "overrides": [
      {
        "files": ['*index.js'], // specify the files you want to ignore
        "rules": {
          'no-unused-vars': 'off', // turn off the rule for these files
        },
      },
    ],
};
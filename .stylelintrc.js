module.exports = {
  root: true,
  extends: 'stylelint-config-standard',
  rules: {
    'at-rule-no-unknown': null,
    'at-rule-empty-line-before': null,
    'block-closing-brace-newline-after': null,
    'color-hex-case': 'lower',
    'no-descending-specificity': null,
    'no-eol-whitespace': null,
    'no-extra-semicolons': null,
    'function-name-case': null,
    'selector-no-qualifying-type': [true, { ignore: ['class', 'attribute'] }],
    'selector-max-id': 0,
    'selector-class-pattern': [/^[a-z][a-zA-Z\-_\d]*\w*$/],
  },
};

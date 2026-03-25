export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'core',
        'web',
        'tables',
        'lists',
        'headers',
        'formatting',
        'codeblocks',
        'cli',
        'ci',
        'readme',
      ],
    ],
    'scope-empty': [1, 'never'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
  },
}

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['@repo/eslint-config/index.js'],
    root: true,
    rules: {
        'no-console': 'off',
    },
}

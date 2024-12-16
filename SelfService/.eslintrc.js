module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true
        },
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks'
    ],
    rules: {
        '@typescript-eslint/array-type': [
            'error',
            {
                'default': 'array'
            }
        ],
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    Object: null,
                    Boolean: null,
                    Number: null,
                    String: null,
                    Symbol: null
                }
            }
        ],
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit'
            }
        ],
        '@typescript-eslint/explicit-module-boundary-types': [
            'error',
            {
                'allowArgumentsExplicitlyTypedAsAny': true
            }
        ],
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/member-ordering': [
            'error',
            {
                'default': [
                    'private-static-field',
                    'public-static-field',
                    'private-instance-field',
                    'public-instance-field',
                    'private-constructor',
                    'public-constructor',
                    'private-instance-method',
                    'protected-instance-method',
                    'public-instance-method'
                ]
            }
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'class',
                format: ['PascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'interface',
                format: ['PascalCase'],
                prefix: ['I']
            }
        ],
        '@typescript-eslint/no-empty-function': 'error',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'off',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/quotes': [
            'error',
            'single'
        ],
        '@typescript-eslint/semi': [
            'error',
            'always'
        ],
        '@typescript-eslint/triple-slash-reference': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/unified-signatures': 'error',
        'arrow-body-style': [
            'error',
            'as-needed'
        ],
        'arrow-parens': [
            'error',
            'as-needed'
        ],
        camelcase: 'error',
        'comma-dangle': 'error',
        complexity: 'off',
        'constructor-super': 'error',
        curly: 'error',
        'default-case': 'off',
        'dot-notation': 'off',
        'eol-last': [
            'error',
            'never'
        ],
        eqeqeq: [
            'warn',
            'always'
        ],
        'guard-for-in': 'off',
        'id-blacklist': [
            'error',
            'cb',
            'any',
            'Number',
            'String',
            'string',
            'Boolean',
            'boolean'
        ],
        'id-match': 'error',
        indent: 'off',
        'linebreak-style': [
            'error',
            'windows'
        ],
        'max-classes-per-file': [
            'error',
            2
        ],
        'max-len': [
            'warn',
            {
                code: 150
            }
        ],
        'new-parens': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-cond-assign': [
            'error',
            'except-parens'
        ],
        'no-console': [
            'warn',
            {
                allow: [
                    'log',
                    'warn',
                    'dir',
                    'time',
                    'timeEnd',
                    'timeLog',
                    'trace',
                    'assert',
                    'clear',
                    'count',
                    'countReset',
                    'group',
                    'groupEnd',
                    'table',
                    'debug',
                    'info',
                    'dirxml',
                    'error',
                    'groupCollapsed',
                    'Console',
                    'profile',
                    'profileEnd',
                    'timeStamp',
                    'context'
                ]
            }
        ],
        'no-debugger': 'error',
        'no-empty': 'error',
        'no-eval': 'warn',
        'no-fallthrough': 'off',
        'no-implicit-coercion': 'off',
        'no-invalid-this': 'off',
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1
            }
        ],
        'no-new-wrappers': 'error',
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'error',
        'no-unsafe-finally': 'error',
        'no-unused-expressions': 'error',
        'no-unused-labels': 'error',
        'no-var': 'error',
        'object-shorthand': 'off',
        'one-var': [
            'error',
            'never'
        ],
        'prefer-arrow/prefer-arrow-functions': 'off',
        'prefer-const': 'error',
        'quote-props': 'off',
        radix: 'error',
        'react/jsx-closing-tag-location': 'error',
        'react/jsx-indent': 'off',
        'react/jsx-key': 1,
        'react/jsx-no-bind': 'warn',
        'react/jsx-no-duplicate-props': [
            1,
            {
                ignoreCase: false
            }
        ],
        'react/jsx-no-target-blank': 'off',
        'react/jsx-one-expression-per-line': 'error',
        'react/jsx-wrap-multilines': [
            'error',
            {
                arrow: 'parens-new-line',
                assignment: 'parens-new-line',
                condition: 'parens-new-line',
                declaration: 'parens-new-line',
                logical: 'parens-new-line',
                prop: 'parens-new-line',
                'return': 'parens-new-line'
            }
        ],
        'react/prop-types': 0,
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'sort-imports': 'off',
        'space-before-function-paren': 'off',
        'spaced-comment': 'error',
        'unicode-bom': 'error',
        'use-isnan': 'error',
        'valid-typeof': 'off'
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': [
                '.ts',
                '.tsx'
            ]
        },
        'import/resolver': {
            typescript: {}
        },
        react: {
            version: 'detect'
        }
    }
};
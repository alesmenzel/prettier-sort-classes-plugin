import prettier from 'prettier'
import babelParser from 'prettier/parser-babel'
import estree from 'prettier/plugins/estree'

const { builders } = prettier.doc

export default {
	options: {
		sortClassesConfig: {
			type: 'string',
			default: '{}',
			description: 'Class names order.',
		},
	},
  languages: [
    {
      name: 'JavaScript',
      parsers: ['babel'],
      extensions: ['.js', '.jsx'],
    },
    {
      name: 'TypeScript',
      parsers: ['babel-ts'],
      extensions: ['.ts', '.tsx'],
    },
  ],
  parsers: {
    babel: { ...babelParser.parsers.babel },
    'babel-ts': { ...babelParser.parsers['babel-ts'] },
  },
  printers: {
    estree: {
      ...estree.printers.estree,
      print (path, options, print) {
				const quote = options.jsxSingleQuote ? "'" : '"'

        const CLASS_LIST = JSON.parse(options.sortClassesConfig)
        const CLASS_LIST_MAP = new Map(CLASS_LIST.map((item, index) => [item, index]))

        function sortClasses (raw) {
          return raw
            .split(/\s+/)
            .filter(Boolean)
            .sort((a, b) => {
              const x = CLASS_LIST_MAP.get(a) ?? Number.POSITIVE_INFINITY
              const y = CLASS_LIST_MAP.get(b) ?? Number.POSITIVE_INFINITY
              const res = x - y
              if (res === 0 || Number.isNaN(res)) {
                return a.localeCompare(b, 'en')
              }
              return res
            })
            .join(' ')
        }

        // WARNING: Because this plugin works with both Babel and Typescript ASTs, there are some
        // differences in the node namings.
        const node = path.getValue()

        // Case 1: className="..."
        // Sort known tokens first, then unknown tokens alphabetically
        if (
          node.type === 'JSXAttribute' &&
					(node.name.name.match(/[cC]lassName$/)) &&
					(node.value?.type === 'StringLiteral' ||
						node.value?.type === 'Literal')
        ) {
          return builders.concat([
            `className=${quote}`,
            sortClasses(node.value.value),
            quote,
          ])
        }

        // Case 2: className={`...`}
        if (
          node.type === 'JSXAttribute' &&
					node.name?.name === 'className' &&
					node.value?.type === 'JSXExpressionContainer' &&
					node.value.expression.type === 'TemplateLiteral'
        ) {
          // Only sort static parts of the template
          const sorted = sortClasses(
            node.value.expression.quasis.map((q) => q.value.raw).join(' ')
          )

          // Reconstruct template: static + dynamic
          const expressions = node.value.expression.expressions.flatMap((
            _,
            i
          ) => [
            '${',
            path.call(print, 'value', 'expression', 'expressions', i),
            '}',
          ])
          return builders.concat([
            'className={`',
            builders.concat([sorted, ' ', ...expressions]),
            '`}',
          ])
        }

        return estree.printers.estree.print(
          path,
          options,
          print
        )
      },
    },
  },
}

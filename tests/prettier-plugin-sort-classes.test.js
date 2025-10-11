import prettier from 'prettier'
import sortClassesPlugin from '../prettier-sort-classes-plugin'

const CLASS_LIST = ['flex', 'flex-1', 'items-center', 'justify-between', 'gap-1', 'gap-2']

describe('prettier-sort-classes-plugin', () => {
  const FIXTURES = {
    static1: {
      before: `\
import React from 'react'

const flag = true

export function Component() {
	return (
		<div className='gap-2 aaa flex bbb items-center justify-between ccc'>
			<div className='gap-2 aaa flex bbb items-center justify-between ccc'>
				Content
			</div>
		</div>
	)
}
`,
      after: `\
import React from 'react'

const flag = true

export function Component() {
	return (
		<div className='flex items-center justify-between gap-2 aaa bbb ccc'>
			<div className='flex items-center justify-between gap-2 aaa bbb ccc'>
				Content
			</div>
		</div>
	)
}
`,
    },
    dynamic1: {
      before: `\
import React from 'react'

const flag = true

export function Component() {
	return (
		<div className='gap-2 aaa flex bbb items-center justify-between ccc'>
			<div
				className={\`aaa flex bbb items-center \${flag ? 'gap-1' : 'gap-2'} justify-between ccc\`}
			>
				Content
			</div>
		</div>
	)
}
`,
      after: `\
import React from 'react'

const flag = true

export function Component() {
	return (
		<div className='flex items-center justify-between gap-2 aaa bbb ccc'>
			<div
				className={\`flex items-center justify-between aaa bbb ccc \${flag
					? 'gap-1'
					: 'gap-2'}\`}
			>
				Content
			</div>
		</div>
	)
}
`,
    },
  }

	for (const [name, data] of Object.entries(FIXTURES)) {
		it(`Fixture: ${name}`, async () => {
			const config = await prettier.resolveConfig(import.meta.dirname)
			const res = await prettier.format(data.before, {
				...config,
				filepath: 'test-file.tsx',
				plugins: [sortClassesPlugin],
				sortClassesConfig: JSON.stringify(CLASS_LIST),
			})
			expect(res).toBe(data.after)
		})
	}
})

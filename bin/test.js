import { configure, processCLIArgs, run } from '@japa/runner'
import { spec } from '@japa/runner/reporters'

configure({
  files: ['tests/**/*.spec.{js,ts}'],
  plugins: [],
  reporters: {
    activated: ['spec'],
    list: [spec()],
  },
})

processCLIArgs(process.argv.slice(2))
run()

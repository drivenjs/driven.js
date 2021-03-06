const register = require('./register')
const chalk = require('chalk')
const async = require('async')
var exports = module.exports = {}
var passed = true

const showLog = (error) => {
  try {
    console.log(error.prettyStack())
  } catch(err) {
    console.log(error.stack)
  }
}

const printHeader = (text) => {
  console.log('------------------------------------------------------------------------------------------')
  console.log(chalk.bold("Suite: ") + text)
  console.log('------------------------------------------------------------------------------------------')
}

const runSuites = (suites) => {
  if(suites.length === 0) {
    if (passed) {
      var statusCode = 0
    } else {
      var statusCode = 1
    }
    process.exit(statusCode)
  }
  const suite = suites.shift()
  printHeader(suite.description)
  suite.run(
    (test) => {
      process.stdout.cursorTo(0)
      process.stdout.write(chalk.bold.blue('⌚') + ' ' + test.description + ' [running]')
    },
    (test) => {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      process.stdout.write(chalk.bold.green('✔') + ' ' + test.description + '\n')
    },
    (test) => {
      passed = false
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      process.stdout.write(chalk.bold.red('✖') + ' ' + test.description + '\n')
      showLog(test.error)
    }
  ).then(() => runSuites(suites), () => runSuites(suites))
}

module.exports.run = () => {
  runSuites(register.suites.slice(0))
}

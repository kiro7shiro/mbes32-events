const { Command } = require('commander')

const program = new Command

program
    .version('0.0.1')
    .description('MBES32 event managing tool')
    .command('report', 'make an events report')
    .command('settings', 'set or get program settings')

module.exports = {
    cli: async function (args) {
        args[1] = __filename // workaround for subcommands
        program.parse(args)
    }
}
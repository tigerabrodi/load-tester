import http from 'http'

import { Command } from 'commander'

const DECIMAL_RADIX = 10

const program = new Command()

program
  .option('-u, --url <type>', 'URL to make HTTP requests to')
  .option('-n, --number <type>', 'Number of requests to make', '1')

program.parse(process.argv)

const options = program.opts()
const numberOfRequests = parseInt(options.number, DECIMAL_RADIX)

for (let i = 0; i < numberOfRequests; i++) {
  http.get(options.url, (response) => {
    console.log(`Response code: ${response.statusCode}`)
  })
}

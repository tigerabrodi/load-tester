import http from 'http'

import { Command } from 'commander'

const program = new Command()

program
  .option('-u, --url <type>', 'URL to make HTTP requests to')
  .option('-n, --number <type>', 'Number of requests to make', '1')

program.parse(process.argv)

const options = program.opts()
const numberOfRequests = parseInt(options.number, 10)

for (let i = 0; i < numberOfRequests; i++) {
  // Make HTTP request to options.url
  http.get(options.url, (response) => {
    console.log(`Response code: ${response.statusCode}`)
  })
}

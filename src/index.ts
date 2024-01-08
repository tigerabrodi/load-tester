import http from 'http'

import { Command } from 'commander'

const program = new Command()

program.argument('<url>', 'URL to make HTTP request to').action((url) => {
  http.get(url, (response) => {
    console.log(`Response code: ${response.statusCode}`)
  })
})

program.parse(process.argv)

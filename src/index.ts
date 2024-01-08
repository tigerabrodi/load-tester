import http from 'http'

import { Command } from 'commander'

const DECIMAL_RADIX = 10

const program = new Command()

program
  .option('-u, --url <type>', 'URL to make HTTP requests to')
  .option('-n, --number <type>', 'Number of requests to make', '1')
  .option('-c, --concurrent <type>', 'Number of concurrent requests', '1')

program.parse(process.argv)

const options = program.opts()
const numberOfRequests = parseInt(options.number, DECIMAL_RADIX)
const concurrentRequests = parseInt(options.concurrent, DECIMAL_RADIX)

const makeRequest = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    http
      .get(url, (response) => {
        console.log(`Response code: ${response.statusCode}`)
        resolve()
      })
      .on('error', (e) => {
        console.error(e)
        reject()
      })
  })
}

const loadTest = async () => {
  // `Math.min(concurrentRequests, numberOfRequests - requestIndex)` needed for the last batch
  for (
    let requestIndex = 0;
    requestIndex < numberOfRequests;
    requestIndex += concurrentRequests
  ) {
    const batch = []
    for (
      let concurrentRequestIndex = 0;
      concurrentRequestIndex <
      Math.min(concurrentRequests, numberOfRequests - requestIndex);
      concurrentRequestIndex++
    ) {
      batch.push(makeRequest(options.url))
    }
    await Promise.all(batch)
  }
}

loadTest()
  .then(() => {
    console.log('Load test completed')
  })
  .catch(() => {
    console.log('Load test failed')
  })

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
const url = options.url
const numberOfRequests = parseInt(options.number, DECIMAL_RADIX)
const concurrentRequests = parseInt(options.concurrent, DECIMAL_RADIX)

if (!url) {
  console.error('URL is required')
  process.exit(1)
}

const shouldOnlyRequestOnce =
  url &&
  (numberOfRequests === 1 || !numberOfRequests) &&
  (concurrentRequests === 1 || !concurrentRequests)

const shouldRequestNTimesLinearly =
  url &&
  numberOfRequests &&
  numberOfRequests > 1 &&
  (concurrentRequests === 1 || !concurrentRequests)

const shouldRequestNTimesConcurrently =
  url &&
  numberOfRequests &&
  numberOfRequests > 1 &&
  concurrentRequests &&
  concurrentRequests > 1

if (shouldOnlyRequestOnce) {
  http.get(url, (response) => {
    console.log(`Response code: ${response.statusCode}`)
  })
  process.exit(0)
}

if (shouldRequestNTimesLinearly) {
  for (let requestIndex = 0; requestIndex < numberOfRequests; requestIndex++) {
    http.get(url, (response) => {
      console.log(`Response code: ${response.statusCode}`)
    })
  }

  process.exit(0)
}

if (shouldRequestNTimesConcurrently) {
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

  const loadTestConcurrently = async () => {
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
        batch.push(makeRequest(url))
      }
      await Promise.all(batch)
    }
  }

  loadTestConcurrently()
    .then(() => {
      console.log('Load test completed')
      process.exit(0)
    })
    .catch(() => {
      console.log('Load test failed')
      process.exit(1)
    })
}

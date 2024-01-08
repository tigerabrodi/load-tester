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

console.log({
  shouldOnlyRequestOnce,
  shouldRequestNTimesLinearly,
  shouldRequestNTimesConcurrently,
})

if (shouldOnlyRequestOnce) {
  new Promise((resolve, reject) => {
    http
      .get(url, (response) => {
        console.log(`Response code: ${response.statusCode}`)
        resolve(response.statusCode === 200)
      })
      .on('error', (error) => {
        console.error(error)
        reject()
      })
  })
    .then(() => {
      console.log('Single request completed')
      process.exit(0)
    })
    .catch(() => {
      console.error('Single request failed')
      process.exit(1)
    })
}

if (shouldRequestNTimesLinearly) {
  const makeSequentialRequest = async (
    url: string,
    index: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      http
        .get(url, (response) => {
          console.log(`Request ${index}: Response code: ${response.statusCode}`)
          resolve()
        })
        .on('error', (error) => {
          console.error(`Request ${index} failed: ${error}`)
          reject()
        })
    })
  }

  const performSequentialRequests = async () => {
    for (
      let requestIndex = 0;
      requestIndex < numberOfRequests;
      requestIndex++
    ) {
      try {
        await makeSequentialRequest(url, requestIndex)
      } catch (error) {
        console.error('Error in sequential requests:', error)
        process.exit(1)
      }
    }
    console.log('All linear requests completed')
  }

  performSequentialRequests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
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
      console.log('Concurrent load test completed')
      process.exit(0)
    })
    .catch(() => {
      console.log('Concurrent load test failed')
      process.exit(1)
    })
}

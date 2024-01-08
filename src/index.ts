import { Command } from 'commander'

import { loadTestConcurrently } from './loadTestNTimesConcurrently'
import { loadTestNTimesLinearly } from './loadTestNTimesLinearly'
import { loadTestOnce } from './loadTestOnce'

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
  loadTestOnce(url)
    .then((value) => {
      console.log(value)
      process.exit(0)
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
} else if (shouldRequestNTimesLinearly) {
  console.log('Performing linearly')
  loadTestNTimesLinearly({ url, numberOfRequests })
    .then(() => {
      console.log('Linear load test completed')
      process.exit(0)
    })
    .catch(() => {
      console.error('Linear load test failed')
      process.exit(1)
    })
} else if (shouldRequestNTimesConcurrently) {
  loadTestConcurrently({
    url,
    numberOfRequests,
    concurrentRequests,
  })
    .then(() => {
      console.log('Concurrent load test completed')
      process.exit(0)
    })
    .catch(() => {
      console.error('Concurrent load test failed')
      process.exit(1)
    })
}

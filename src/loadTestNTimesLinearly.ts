import http from 'http'

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

export const loadTestNTimesLinearly = async ({
  url,
  numberOfRequests,
}: {
  url: string
  numberOfRequests: number
}) => {
  let failedRequests = 0
  let successRequests = 0

  for (let requestIndex = 0; requestIndex < numberOfRequests; requestIndex++) {
    try {
      await makeSequentialRequest(url, requestIndex)
      successRequests++
    } catch (error) {
      failedRequests++
    }
  }

  console.log('Reached the end of loadTestNTimesLinearly')
  console.log(`Successful requests: ${successRequests}`)
  console.log(`Failed requests: ${failedRequests}`)
}

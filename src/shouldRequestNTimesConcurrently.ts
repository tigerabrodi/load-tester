import http from 'http'

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

export const loadTestConcurrently = async ({
  url,
  numberOfRequests,
  concurrentRequests,
}: {
  url: string
  numberOfRequests: number
  concurrentRequests: number
}) => {
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

import http from 'http'

const makeRequest = (url: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    http
      .get(url, (response) => {
        console.log(`Response code: ${response.statusCode}`)
        if (
          response.statusCode &&
          response.statusCode >= 200 &&
          response.statusCode < 300
        ) {
          resolve({ success: true })
        } else {
          resolve({ success: false }) // handle non-success HTTP statuses as successful promises but failed requests
        }
      })
      .on('error', (e) => {
        console.error(e)
        resolve({ success: false }) // handle network errors as successful promises but failed requests
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
  let failedRequests = 0
  let successRequests = 0

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

    const results = await Promise.all(batch)
    results.forEach((result) => {
      if (result.success) {
        successRequests++
      } else {
        failedRequests++
      }
    })
  }

  console.log('Reached the end of loadTestConcurrently')
  console.log(`Successful requests: ${successRequests}`)
  console.log(`Failed requests: ${failedRequests}`)
}

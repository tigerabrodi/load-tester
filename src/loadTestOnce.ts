import http from 'http'

export async function loadTestOnce(url: string) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (response) => {
        console.log(`Response code: ${response.statusCode}`)
        resolve('Single request completed.')
      })
      .on('error', (error) => {
        console.error(error)
        reject('Single request failed.')
      })
  })
}

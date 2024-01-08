import http from 'http'
import { performance } from 'perf_hooks'

export async function loadTestOnce(url: string) {
  const startTime = performance.now()

  return new Promise((resolve, reject) => {
    http
      .get(url, (response) => {
        const firstByteTime = performance.now()
        response.on('data', () => {})
        response.on('end', () => {
          const endTime = performance.now()
          const stats = {
            startTime,
            firstByteTime,
            endTime,
            statusCode: response.statusCode,
          }
          resolve(stats)
        })
      })
      .on('error', (error) => {
        console.error(error)
        const endTime = performance.now()
        const stats = {
          startTime,
          firstByteTime: endTime, // In case of error, we set firstByteTime same as endTime
          endTime,
          statusCode: 0, // Indicates an error occurred
        }
        reject(stats)
      })
  })
}

import type { RequestStat } from './types'

import http from 'http'

import { calculateStats } from './calculateStats'
import { displayFormattedStats } from './displayFormattedStats'

const makeSequentialRequest = async (
  url: string,
  index: number
): Promise<RequestStat> => {
  const startTime = performance.now()

  return new Promise((resolve, reject) => {
    http
      .get(url, (response) => {
        const firstByteTime = performance.now()
        response.on('data', () => {})
        response.on('end', () => {
          const endTime = performance.now()
          resolve({
            startTime,
            firstByteTime,
            endTime,
            statusCode: response.statusCode as number,
          })
        })
      })
      .on('error', (error) => {
        console.error(`Request ${index} failed: ${error}`)
        const endTime = performance.now()
        reject({
          startTime,
          firstByteTime: endTime,
          endTime,
          statusCode: 0,
        })
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
  const requestStats: Array<RequestStat> = []

  for (let requestIndex = 0; requestIndex < numberOfRequests; requestIndex++) {
    try {
      const stats = await makeSequentialRequest(url, requestIndex)
      requestStats.push(stats)
    } catch (errorStats) {
      requestStats.push(errorStats as RequestStat)
    }
  }

  displayFormattedStats(calculateStats(requestStats))
}

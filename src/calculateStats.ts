import type { RequestStat } from './types'

export type CalculatedStats = ReturnType<typeof calculateStats>

export function calculateStats(requestStats: Array<RequestStat>) {
  let total2XX = 0,
    total5XX = 0
  const totalRequestTimes: Array<number> = [],
    timeToFirstBytes: Array<number> = [],
    timeToLastBytes: Array<number> = []

  requestStats.forEach((stat) => {
    if (stat.statusCode >= 200 && stat.statusCode < 300) total2XX++
    if (stat.statusCode >= 500 && stat.statusCode < 600) total5XX++

    totalRequestTimes.push(stat.endTime - stat.startTime)
    timeToFirstBytes.push(stat.firstByteTime - stat.startTime)
    timeToLastBytes.push(stat.endTime - stat.firstByteTime)
  })

  const calculateMinMaxMean = (times: Array<number>) => {
    const min = Math.min(...times)
    const max = Math.max(...times)

    // average = sum of all values / number of values
    const mean = times.reduce((a, b) => a + b, 0) / times.length
    return { min, max, mean }
  }

  return {
    total2XX,
    total5XX,
    // Get latest request's end time minus earliest request's start time to get total time elapsed
    requestsPerSecond:
      (requestStats.length /
        (Math.max(...requestStats.map((s) => s.endTime)) -
          Math.min(...requestStats.map((s) => s.startTime)))) *
      1000,
    totalRequestTime: calculateMinMaxMean(totalRequestTimes),
    timeToFirstByte: calculateMinMaxMean(timeToFirstBytes),
    timeToLastByte: calculateMinMaxMean(timeToLastBytes),
  }
}

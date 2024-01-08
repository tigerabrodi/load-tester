import type { RequestStat } from './types'

export type CalculatedStats = {
  total2XX: number
  total5XX: number
  requestsPerSecond: string // Since you're converting to string with toFixed(2)
  totalRequestTime: { min: string; max: string; mean: string }
  timeToFirstByte: { min: string; max: string; mean: string }
  timeToLastByte: { min: string; max: string; mean: string }
}

export function calculateStats(
  requestStats: Array<RequestStat>
): CalculatedStats {
  let total2XX = 0,
    total5XX = 0
  const totalRequestTimes: Array<number> = [],
    timeToFirstBytes: Array<number> = [],
    timeToLastBytes: Array<number> = []

  requestStats.forEach((stat) => {
    if (stat.statusCode >= 200 && stat.statusCode < 300) total2XX++
    if (stat.statusCode >= 500 && stat.statusCode < 600) total5XX++

    // Convert milliseconds to seconds
    totalRequestTimes.push((stat.endTime - stat.startTime) / 1000)
    timeToFirstBytes.push((stat.firstByteTime - stat.startTime) / 1000)
    timeToLastBytes.push((stat.endTime - stat.firstByteTime) / 1000)
  })

  const calculateMinMaxMean = (times: Array<number>) => {
    const min = Math.min(...times)
    const max = Math.max(...times)
    const mean = times.reduce((a, b) => a + b, 0) / times.length
    return { min: min.toFixed(2), max: max.toFixed(2), mean: mean.toFixed(2) }
  }

  const totalTime =
    Math.max(...requestStats.map((s) => s.endTime)) -
    Math.min(...requestStats.map((s) => s.startTime))

  return {
    total2XX,
    total5XX,
    requestsPerSecond:
      totalTime > 0
        ? (requestStats.length / (totalTime / 1000)).toFixed(2)
        : '0',
    totalRequestTime: calculateMinMaxMean(totalRequestTimes),
    timeToFirstByte: calculateMinMaxMean(timeToFirstBytes),
    timeToLastByte: calculateMinMaxMean(timeToLastBytes),
  }
}

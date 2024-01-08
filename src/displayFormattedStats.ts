import type { CalculatedStats } from './calculateStats'

export function displayFormattedStats(stats: CalculatedStats) {
  console.log('Results:')
  console.log(` Total Requests (2XX).......................: ${stats.total2XX}`)
  console.log(` Failed Requests (5XX)......................: ${stats.total5XX}`)
  console.log(
    ` Request/second.............................: ${stats.requestsPerSecond}`
  )

  console.log('')
  console.log(
    `Total Request Time (s) (Min, Max, Mean).....: ${stats.totalRequestTime.min}, ${stats.totalRequestTime.max}, ${stats.totalRequestTime.mean}`
  )
  console.log(
    `Time to First Byte (s) (Min, Max, Mean).....: ${stats.timeToFirstByte.min}, ${stats.timeToFirstByte.max}, ${stats.timeToFirstByte.mean}`
  )
  console.log(
    `Time to Last Byte (s) (Min, Max, Mean)......: ${stats.timeToLastByte.min}, ${stats.timeToLastByte.max}, ${stats.timeToLastByte.mean}`
  )
}

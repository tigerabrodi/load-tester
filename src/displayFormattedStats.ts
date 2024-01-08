import type { CalculatedStats } from './calculateStats'

export function displayFormattedStats(stats: CalculatedStats) {
  const formatTime = (time: number) => time.toFixed(2)

  console.log('Results:')
  console.log(` Total Requests (2XX).......................: ${stats.total2XX}`)
  console.log(` Failed Requests (5XX)......................: ${stats.total5XX}`)
  console.log(
    ` Request/second.............................: ${formatTime(
      stats.requestsPerSecond
    )}`
  )

  console.log('')
  console.log(
    `Total Request Time (s) (Min, Max, Mean).....: ${formatTime(
      stats.totalRequestTime.min
    )}, ${formatTime(stats.totalRequestTime.max)}, ${formatTime(
      stats.totalRequestTime.mean
    )}`
  )
  console.log(
    `Time to First Byte (s) (Min, Max, Mean).....: ${formatTime(
      stats.timeToFirstByte.min
    )}, ${formatTime(stats.timeToFirstByte.max)}, ${formatTime(
      stats.timeToFirstByte.mean
    )}`
  )
  console.log(
    `Time to Last Byte (s) (Min, Max, Mean)......: ${formatTime(
      stats.timeToLastByte.min
    )}, ${formatTime(stats.timeToLastByte.max)}, ${formatTime(
      stats.timeToLastByte.mean
    )}`
  )
}

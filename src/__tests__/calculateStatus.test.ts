import { it, expect } from 'vitest'

import { calculateStats } from '../calculateStats'

it('should calculate stats for a basic scenario', () => {
  const requestStats = [
    { startTime: 100, firstByteTime: 150, endTime: 200, statusCode: 200 },
    { startTime: 200, firstByteTime: 250, endTime: 300, statusCode: 200 },
    { startTime: 300, firstByteTime: 350, endTime: 400, statusCode: 500 },
  ]
  const stats = calculateStats(requestStats)

  expect(stats.total2XX).toBe(2)
  expect(stats.total5XX).toBe(1)
  expect(stats.requestsPerSecond).toBeCloseTo(10)
  expect(stats.totalRequestTime.mean).toBeCloseTo(100)
  expect(stats.timeToFirstByte.mean).toBeCloseTo(50)
  expect(stats.timeToLastByte.mean).toBeCloseTo(50)
})

it('should calculate stats when all requests are successful', () => {
  const requestStats = [
    { startTime: 100, firstByteTime: 150, endTime: 200, statusCode: 200 },
    { startTime: 200, firstByteTime: 250, endTime: 300, statusCode: 200 },
  ]
  const stats = calculateStats(requestStats)

  expect(stats.total2XX).toBe(2)
  expect(stats.total5XX).toBe(0)
})

it('should calculate stats for a mix of successful and failed requests', () => {
  const requestStats = [
    { startTime: 100, firstByteTime: 150, endTime: 200, statusCode: 200 },
    { startTime: 200, firstByteTime: 250, endTime: 300, statusCode: 500 },
    { startTime: 300, firstByteTime: 350, endTime: 400, statusCode: 500 },
  ]
  const stats = calculateStats(requestStats)

  expect(stats.total2XX).toBe(1)
  expect(stats.total5XX).toBe(2)
})

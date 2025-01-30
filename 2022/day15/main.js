
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn } = require('../../utils')

// https://adventofcode.com/2022/day/15

process.chdir('/Users/nmiles/source/aoc/2022/day15')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
data = testData

function mergeIntervals(intervals) {
    let i = 0
    while (i < intervals.length - 1) {
        let [start, end] = intervals[i]
        let [nextStart, nextEnd] = intervals[i+1]
        assert(start <= nextStart)

        if (end+1 >= nextStart) {
            intervals.splice(i, 2, [start, Math.max(end, nextEnd)])
        } else {
            i++
        }
    }
}

function addInterval(intervals, interval) {
    let [start, end] = interval
    let i = intervals.findIndex(([s,e]) => start <= s)
    if (i === -1) {
        // start is greater than the starting point of all intervals
        intervals.push(interval)
        mergeIntervals(intervals)
        return
    }

    intervals.splice(i, 0, interval)
    mergeIntervals(intervals)
    return intervals
}

function invertIntervals(intervals, start, end) {
    let _intervals = []
    let i = 0
    while (start <= end) {
        if (i >= intervals.length) {
            _intervals.push([start, end])
            break
        }
        
        let [s, e] = intervals[i]
        let _end = Math.min(s-1, end)
        if (_end >= start) {
            _intervals.push([start, _end])
        }
        start = e + 1
        i = i + 1
    }

    return _intervals
}

assert.deepStrictEqual(addInterval([[1, 2], [4, 5]], [3, 4]), [[1, 5]])
assert.deepStrictEqual(invertIntervals([[1, 2]], 0, 3), [[0, 0], [3, 3]])


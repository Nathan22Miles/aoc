
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
// data = testData

function parseXY(t) { 
    let {x, y} = /.*x=(?<x>-?\d+).*y=(?<y>-?\d+)/.exec(t).groups
    return {x: parseInt(x), y: parseInt(y)}
}

function parseLine(line) {
    let [s, b] = line.split(':')
    return [parseXY(s), parseXY(b)]
}

ps = data.split('\n').map(parseLine) // [ [sensor, beacon], ... ]

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

// assert.deepStrictEqual(addInterval([[1, 2], [4, 5]], [3, 4]), [[1, 5]])

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

function excluded(p, y) {
    let { x: sx, y: sy } = p[0]
    let { x: bx, y: by } = p[1]
    let bdist = Math.abs(sx - bx) + Math.abs(sy - by)
    let ldist = Math.abs(sy - y)
    let diff = bdist - ldist
    if (diff<0) return undefined
    return [sx-diff, sx+diff]
}

// log(excluded(ps[6], 10)) => [2,14]

function calcExcluded(ps, y) {
    let intervals = []
    for (let p of ps) {
        let interval = excluded(p, y)
        if (interval) {
            addInterval(intervals, interval)
        }
    }

    return intervals
}

function countExcluded(intervals) {
    return intervals.map(([s,e]) => e-s).sum()
}

// log(countExcluded(calcExcluded(ps, 10))) // should be 26
// log(countExcluded(calcExcluded(ps, 2000000))) // should be 5525990

let limit = 4000000
for (let y=0; y<=limit; y++) {
    let intervals = calcExcluded(ps, y)
    if (intervals.length === 2) {
        // there is only 1 interval with a gap
        let x = intervals[0][1] + 1
        log(limit*x+y) // output 'frequency'
        break
    }
}

log('done')

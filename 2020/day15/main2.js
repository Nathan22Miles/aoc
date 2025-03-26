const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

let data = [6, 19, 0, 5, 7, 13, 1]
// data = [0, 3, 6]

// https://adventofcode.com/2020/day/15
process.chdir('/Users/nmiles/source/aoc/2020/day15')

// let data = fs.readFileSync('data.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let last = new Map()
let count = 0

function add(_last) {
    ++count
    let n = 0
    if (last.has(_last)) {
        n = count - last.get(_last)
    }
    last.set(_last, count)
    // log('n', n)
    return n
}

for (let n of data.slice(0, data.length-1)) {
    ++count
    last.set(n, count)
}

let _last = data.last()
let limit = 30000000
// limit = 2020
// limit = 10

while (count < limit-1) {
    _last = add(_last)
}

log(_last)


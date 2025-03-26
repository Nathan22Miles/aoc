const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

let data = [6, 19, 0, 5, 7, 13, 1]
// data = [0, 3, 6]
// data = [3,1,2]

// https://adventofcode.com/2020/day/15
process.chdir('/Users/nmiles/source/aoc/2020/day15')

// let data = fs.readFileSync('data.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

function add() {
    let last = data[data.length - 1]
    let i = data.length - 2
    while (i >= 0) {
        if (data[i] === last) {
            data.push(data.length - i - 1)
            return
        }
        i--
    }
    data.push(0)
}

while (data.length < 2020) {
    add()
}

log(data.last())


const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')

// https://adventofcode.com/2021/day/13
process.chdir('/Users/nmiles/source/aoc/2021/day13')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData
let [_pts, _folds] = data.split('\n\n')

let pts = new JSet(
        _pts.split('\n')
            .map(line => line.split(',').map(parseIntFn)))
let folds = _folds.split('\n').map(line => line.split('='))

for (let fold of folds) {
    let [axis, n] = fold
    n = parseInt(n)
    axis = axis.slice(-1) === 'x' ? 0 : 1
    let newPts = new JSet()

    for (let pt of pts) {
        if (pt[axis] > n) {
            pt[axis] = 2 * n - pt[axis]
        }
        newPts.add(pt)
    }
    pts = newPts
}

[...pts].logRCs()

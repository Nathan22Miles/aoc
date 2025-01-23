
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn } = require('../../utils')

// https://adventofcode.com/2023/day/24

process.chdir('/Users/nmiles/source/aoc/2023/day24')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let stones = data.split('\n').map(line => line.match(/(-?\d+)/g).map(parseIntFn))

function canCollide(s1, s2, low, high) {
    let [x1, y1, z1, xv1, yv1, zv1] = s1
    let [x2, y2, z2, xv2, yv2, zv2] = s2

    let m1 = yv1 / xv1
    let m2 = yv2 / xv2

    if (m1 === m2) return 0

    let [a1, b1, c1] = [-m1, 1, -m1 * x1 + y1]
    let [a2, b2, c2] = [-m2, 1, -m2 * x2 + y2]

    let [x, y] = solveLinear(a1, b1, c1, a2, b2, c2)

    // log(x, y)

    if (x === undefined) {
        debugger
    }

    let t1 = (x - x1) / xv1
    let t2 = (x - x2) / xv2
    if (t1 < 0 || t2 < 0) return 0

    return Number(x >= low && x <= high && y >= low && y <= high)
}

log(stones.pairs()
    .map(([s1, s2]) => canCollide(s1, s2, 200000000000000, 400000000000000))
    // .log()
    .sum())

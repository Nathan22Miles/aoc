// adapted from https://topaz.github.io

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, runBFS, Comp } = require('../../utils')
const { nextTick } = require('process')

// https://adventofcode.com/2022/day/22
process.chdir('/Users/nmiles/source/aoc/2022/day22')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
data = testData

data = fs.readFileSync('test.txt', 'utf8') // unit test

let [map, path] = data.split('\n\n')
let rows = map.split('\n').map(row => row.split(''))

function vld(cc) { return cc !== undefined && cc !== ' ' }
function wall(cr) { return fetch(cr) === '#' }
function fetch([c, r]) { return rows[r][c] }

let colLengths = rows.map(row => row.length).max()

let rowFls = rows.map(row => row.findFirstAndLast(vld))
let colFls = rng(colLengths)
                .map(c => rows.map(row => row[c])
                .findFirstAndLast(vld))

let moves = [
    ([c, r]) => c < rowFls[r].last ? [c+1, r] : [rowFls[r].first, r], // right
    ([c, r]) => r < colFls[c].last ? [c, r+1] : [c, colFls[c].first], // down
    ([c, r]) => c > rowFls[r].first ? [c-1, r] : [rowFls[r].last, r], // left
    ([c, r]) => r > colFls[c].first ? [c, r-1] : [c, colFls[c].last], // up
]

assert.deepStrictEqual(moves[0]([2, 2]), [3, 2])
assert.deepStrictEqual(moves[0]([3, 2]), [2, 2])
assert.deepStrictEqual(moves[1]([3, 1]), [3, 2])
assert.deepStrictEqual(moves[1]([3, 2]), [3, 1])
assert.deepStrictEqual(moves[2]([3, 2]), [2, 2])
assert.deepStrictEqual(moves[2]([2, 2]), [3, 2])
assert.deepStrictEqual(moves[3]([3, 1]), [3, 2])
assert.deepStrictEqual(moves[3]([3, 2]), [3, 1])

let _dir = 0

// function go(pxy, dir, len) {
//     for (let i=0; i<len; i++) {
//         let npxy = next(pxy, dir)
//         if (fetch(npxy) === '#') return pxy
//         pxy = npxy
//     }
// }
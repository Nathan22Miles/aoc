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

let _dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]
let _dir = 0


function vld(x,y) {
    if (y < 0 || y >= rows.length) return false
    if (x < 0 || x >= rows[y].length) return false
    if (rows[y][x] === ' ') return false
    return true
}

function next([x, y], dir) {
    let nx
    let ny
    switch (dir) {
        case 0: // right
            if (vld(x+1, y)) return [x+1, y]
            nx = 0
            while (!vld(nx, y)) nx++
            return [nx, y]
        case 1: // down
            if (vld(x, y+1)) return [x, y+1]
            ny = 0
            while (!vld(x, ny)) ny++
            return [x, ny]
        case 2: // left
            if (vld(x - 1, y)) return [x-1, y]
            nx = rows[y].length - 1
            while (!vld(nx, y)) nx--
            return [nx, y]
        case 3: // up
            if (vld(x, y-1)) return [x, y-1]
            ny = rows.length - 1
            while (!vld(x, ny)) ny--
            return [x, ny]
        default:
            assert(false)
    }
}

assert.deepStrictEqual(next([2, 2], 0), [3, 2])
assert.deepStrictEqual(next([3, 2], 0), [2, 2])

assert.deepStrictEqual(next([3, 1], 1), [3, 2])
assert.deepStrictEqual(next([3, 2], 1), [3, 1])

assert.deepStrictEqual(next([3, 2], 2), [2, 2])
assert.deepStrictEqual(next([2, 2], 2), [3, 2])

assert.deepStrictEqual(next([3, 1], 3), [3, 2])
assert.deepStrictEqual(next([3, 2], 3), [3, 1])

function go(pxy, dir, len) {
    for (let i=0; i<len; i++) {
        let npxy = next(pxy, dir)
        if (fetch(npxy) === '#') return pxy
        pxy = npxy
    }
}
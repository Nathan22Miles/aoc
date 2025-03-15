const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')
const { clear } = require('console')

let vars = 'abcdefghijklmn'.split('')

// https://adventofcode.com/2021/day/25
process.chdir('/Users/nmiles/source/aoc/2021/day25')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let _m = new Maze(data)
let { r: _r, c: _c, m } = _m

function moveEast(r) {
    let p0 = _m.rc2p([r, 0])
    let pLast = p0 + _c
    function next(p) { return p + 1 < pLast ? p + 1 : p0 }
    let moves = rng(_c).map(c => [p0+c, next(p0+c)])
        .filter(([p, pn]) => m[p] === '>' && m[pn] === '.')

    for (let [p, pn] of moves) {
        m[p] = '.'
        m[pn] = '>'
    }
    return moves.length > 0
}

function moveSouth(c) {
    let p0 = _m.rc2p([0, c])
    let pLast = _m.rc2p([_r, c])
    
    function next(p) { return p + _c < pLast ? p + _c : p0 }

    let moves = rng(_r).map(r => [p0 + r*_c, next(p0 + r*_c)])
        .filter(([p, pn]) => m[p] === 'v' && m[pn] === '.')

    for (let [p, pn] of moves) {
        m[p] = '.'
        m[pn] = 'v'
    }
    return moves.length > 0
}

let steps = 0
while (true) {
    ++steps
    let moved = false
    for (let r of rng(_r)) {
        moved = moveEast(r) || moved
    }
    for (let c of rng(_c)) {
        moved = moveSouth(c) || moved
    }
    log(steps)
    // log(_m.toString())
    if (!moved) {
        break
    }
}

log(steps)

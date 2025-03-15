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

class Wrap2 {
    constructor(data) {
        this.m = data.split('\n').map(line => line.split(''))
        this._r = this.m.length
        this._c = this.m[0].length
    }

    _(r, c) {
        return this.m[r % this._r][c % this._c]
    }

    set(r, c, val) {
        this.m[r % this._r][c % this._c] = val
    }
}

let wrap = new Wrap2(data)
let {_r, _c} = wrap

let get = (r, c) => wrap._(r, c)
let set = (r, c, val) => wrap.set(r, c, val)

function moveEast(r) {
    let columns = rng(_c).filter(c => get(r, c) === '>' && get(r,c+1) === '.')

    for (let c of columns) {
        set(r, c, '.')
        set(r, c+1, '>')
    }
    return columns.length > 0
}

function moveSouth(c) {
    let rows = rng(_r).filter(r => get(r, c) === 'v' && get(r+1, c) === '.')

    for (let r of rows) {
        set(r, c, '.')
        set(r+1, c, 'v')
    }
    return rows.length > 0
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

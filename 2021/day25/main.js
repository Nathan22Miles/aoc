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

class Wrap {
    constructor(data) {
        this.m = data.split('\n').map(line => line.split(''))
        this._r = this.m.length
        this._c = this.m[0].length
    }

    _(r, c) { return this.m[r % this._r][c % this._c] }

    rc([r, c]) { return this._(r, c) }

    setRc([r, c], val) { return this.set(r, c, val) }

    set(r, c, val) { this.m[r % this._r][c % this._c] = val }
}

let w = new Wrap(data)
let {_r, _c} = w

function canEast([r,c]) { return w.rc([r,c]) === '>' && w.rc([r, c+1]) === '.' }
function moveEast([r,c]) { w.setRc([r,c], '.'); w.setRc([r,c+1], '>'); return 1 }

function canSouth([r, c]) { return w.rc([r, c]) === 'v' && w.rc([r+1, c]) === '.' }
function moveSouth([r, c]) { w.setRc([r, c], '.'); w.setRc([r+1, c], 'v'); return 1 }

function moveRowEast(r) { return rng(_c).map(c => [r,c]).filter(canEast).map(moveEast) }
function moveColSouth(c) { return rng(_r).map(r => [r,c]).filter(canSouth).map(moveSouth) }

let steps = 1
while (true) {
    if (rng(_r).map(moveRowEast).flat().length + rng(_c).map(moveColSouth).flat().length === 0) break 
    ++steps
}

log(steps)

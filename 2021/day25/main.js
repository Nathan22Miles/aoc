const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

let vars = 'abcdefghijklmn'.split('')

// https://adventofcode.com/2021/day/25
process.chdir('/Users/nmiles/source/aoc/2021/day25')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let w = new Wrap2D(data)
let {_r, _c} = w

function canEast([r,c]) { return w.rc([r,c]) === '>' && w.rc([r, c+1]) === '.' }
function moveEast([r,c]) { w.setRc([r,c], '.'); w.setRc([r,c+1], '>'); return 1 }

function canSouth([r, c]) { return w.rc([r, c]) === 'v' && w.rc([r+1, c]) === '.' }
function moveSouth([r, c]) { w.setRc([r, c], '.'); w.setRc([r+1, c], 'v'); return 1 }

function moveRowEast(r) { return w.rowRcs(r).filter(canEast).map(moveEast) }
function moveColSouth(c) { return w.colRcs(c).filter(canSouth).map(moveSouth) }

log(countFn(() => rng(_r).map(moveRowEast).flat().length + rng(_c).map(moveColSouth).flat().length > 0))

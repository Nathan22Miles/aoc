// adapted from https://topaz.github.io

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, runBFS, Comp } = require('../../utils')

// https://adventofcode.com/2022/day/22
process.chdir('/Users/nmiles/source/aoc/2022/day22')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

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


function go(cr, dir, len) {
    for (let i=0; i<len; i++) {
        let _cr = moves[dir](cr)
        if (wall(_cr)) break
        cr = _cr
    }

    return cr
}

let _dir = 0
let cr = [rowFls[0].first, 0]
let parts = path.split(/(\d+)/)

for (let i=1; i<parts.length; i+=2) {
    let len = parseInt(parts[i])
    cr = go(cr, _dir, len)
    if (parts[i+1] === 'L') _dir = (_dir + 3) % 4
    if (parts[i+1] === 'R') _dir = (_dir + 1) % 4
    // log(cr, _dir)
}

// test data = 6032
log(1000*(cr[1]+1) + 4*(cr[0]+1) + _dir)
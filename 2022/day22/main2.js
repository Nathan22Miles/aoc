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

let next = new Map()

let edges = [
    '149,0+ 99,149-', // a
    '149-,49 99,99-', // b
    '99-,149 49,199-', // c
    '49-,199 149-,0', // d
    '0,199- 99-,0',  // e
    '0,149- 50,0+',  // f
    '49-,100 50,99-', // g
]

function calcCR(edge, i) {
    let parts = edge.split(/(\d+)/)
    let [c, r] = [parseInt(parts[1]), parseInt(parts[3])]
    if (parts[2] === '-,') { return [c-i, r] }
    if (parts[2] === '+,') { return [c+i, r] }
    if (parts[4] === '-') { return [c, r-i] }
    if (parts[4] === '+') { return [c, r+i] }
    assert(false,'no interator')
}

let _next = [
    [0,2,0,2], // a
    [1,2,0,3], // b
    [1,2,0,3], // c
    [1,1,3,3], // d
    [2,1,3,0], // e
    [2,0,2,0], // f
    [3,0,2,1], // g
]

function key([c, r], dir) { return `${c}-${r}-${dir}` }

function buildNext() {
    for (let i=0; i<50; ++i) {
        for (let j=0; j<7; ++j) {
            let [edge1, edge2] = edges[j].split(' ')
            let cr1 = calcCR(edge1, i)
            let cr2 = calcCR(edge2, i)
            let dirs = _next[j]
            next.set(key(cr1, dirs[0]), [...cr2, dirs[1]])
            next.set(key(cr2, dirs[2]), [...cr1, dirs[3]])
        }
    }
}

buildNext()

let moves = [
    ([c, r]) => c < rowFls[r].last ? [c+1, r] : next.get(key([c, r], 0)), // right
    ([c, r]) => r < colFls[c].last ? [c, r + 1] : next.get(key([c, r], 1)), // down
    ([c, r]) => c > rowFls[r].first ? [c - 1, r] : next.get(key([c, r], 2)), // left
    ([c, r]) => r > colFls[c].first ? [c, r - 1] : next.get(key([c, r], 3)), // up
]

function go(cr, dir, len) {
    for (let i=0; i<len; i++) {
        let _cr = moves[dir](cr)
        assert(_cr, `no next for ${cr} dir=${dir}`)
        if (_cr.length === 3) {
            _dir = _cr[2]
            _cr = _cr.slice(0, 2)
        }
        if (wall(_cr)) break
        cr = _cr
        dir = _dir
        // log(cr, dir)
    }

    return [cr, dir]
}

let _dir = 0
let cr = [rowFls[0].first, 0]
let parts = path.split(/(\d+)/)

for (let i=1; i<parts.length; i+=2) {
    let len = parseInt(parts[i]);
    [cr, _dir] = go(cr, _dir, len)
    if (parts[i+1] === 'L') _dir = (_dir + 3) % 4
    if (parts[i+1] === 'R') _dir = (_dir + 1) % 4
    // log(cr, _dir)
}

// part1 test data = 6032
log(1000*(cr[1]+1) + 4*(cr[0]+1) + _dir)
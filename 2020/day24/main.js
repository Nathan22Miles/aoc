const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2020/day/24
process.chdir('/Users/nmiles/source/aoc/2020/day24')

let _move = {
    e: [0, 1],
    se: [1, 1],
    sw: [1, 0],
    w: [0, -1],
    nw: [-1, -1],
    ne: [-1, 0],
}

function splitPath(path) {
    let parts = path.split(/(se|sw|ne|nw|e|w)/).filter(x => x.length > 0)
    
    assert(parts.every(p => _move[p]))
    assert(parts.join('') === path)
    
    return parts
}

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let paths = data.split('\n')
    .map(splitPath)

let blackS = new Set()

for (let path of paths) {
    let pos = [0, 0]
    for (let m of path) {
        pos[0] += _move[m][0]
        pos[1] += _move[m][1]
    }
    
    let key = pos.join(',')
    if (blackS.has(key)) {
        blackS.delete(key)
    } else {
        blackS.add(key)
    }
}

// 337 too low

log(blackS.size)
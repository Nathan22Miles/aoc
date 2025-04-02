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

let _neighbors = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, -1], [-1, 0]]

function neighborsKeys(pos) {
    return _neighbors.map(n => pos.add(n)).map(rc => rc.join(','))
}

function parseKey(key) {
    return key.split(',').map(parseIntFn)
}

function neighborCount(bKey, blackS) {
    let pos = parseKey(bKey)
    return neighborsKeys(pos).map(key => blackS.has(key) ? 1 : 0).sum()
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

// black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
// Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.

function cycle() {
    let _blackS = new Set()

    for (let bKey of blackS) {
        let count = neighborCount(bKey, blackS)
        if (count === 1 || count === 2) _blackS.add(bKey)
    }

    for (let bKey of blackS) {
        for (let wKey of neighborsKeys(parseKey(bKey))) {
            if (blackS.has(wKey)) continue  // skip if not white
            let count = neighborCount(wKey, blackS)
            if (count === 2) _blackS.add(wKey)
        }
    }

    return _blackS
}

for (let i=0; i<100; ++i) {
    blackS = cycle(blackS)
}

log(blackS.size)
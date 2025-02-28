const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, runBFS, Comp, JSet, JMap } = require('../../utils')

// https://adventofcode.com/2022/day/23
process.chdir('/Users/nmiles/source/aoc/2022/day23')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let map = data.split('\n').map(line => line.split(''))
let _elves = rng2(map[0].length, map.length)
    .filter(([c, r]) => map[r][c] === '#')

const [NW, N, NE, W, E, SW, S, SE] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
const allDirs = [NW, N, NE, W, E, SW, S, SE]

let nextDirections = [
    [N, NW, NE],
    [S, SE, SW],
    [W, NW, SW],
    [E, NE, SE],
]

function nextPosition(elf, occupied) {
    /** Directions in which there is an adjacent # */
    let adjs = allDirs.filter(dir => occupied.has(elf.add(dir)))
    if (adjs.length === 0) return null // if no adjacent elves, stay put

    let dir = nextDirections.find(dirs => dirs.every(dir => !adjs.includes(dir)))
    return (dir && elf.add(dir[0])) || null
}

function round(elves, _round) {
    let occupied = new JSet(elves)
    let nexts = elves.map(elf => nextPosition(elf, occupied))
    let nextsSet = new JSet(nexts)
    let moved = 0

    for (let i = 0; i < elves.length; i++) {
        let p = nexts[i]
        if (p === null || nextsSet.count(p) > 1) continue
        moved++
        elves[i] = p
    }

    nextDirections.rotateLeft()

    return moved
}

function logElves(elves) {
    elves.normalize2D()
    let { right, bottom } = elves.bounds2D()

    let _map = make2D(bottom + 1, right + 1, '.')
    elves.forEach(([c, r]) => _map[r][c] = '#')
    let rows = _map.map(row => row.join(''))
    log(rows.join('\n'))
    log('.')
}

for (let i=0; ; i++) {
    let moved = round(_elves, i+1)
    if (moved === 0) {
        log('done', i+1)
        break
    }
}

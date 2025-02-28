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

/*
If there is no Elf in the N, NE, or NW adjacent positions, the Elf proposes moving north one step.
If there is no Elf in the S, SE, or SW adjacent positions, the Elf proposes moving south one step.
If there is no Elf in the W, NW, or SW adjacent positions, the Elf proposes moving west one step.
If there is no Elf in the E, NE, or SE adjacent positions, the Elf proposes moving east one step.
 */

const [NW, N, NE, W, E, SW, S, SE] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
const allDirs = [NW, N, NE, W, E, SW, S, SE]

let proposeds = [
    [N, NW, NE],
    [S, SE, SW],
    [W, NW, SW],
    [E, NE, SE],
]

/** Directions in which there is an adjacent # */
function adjacents(dirs, elf, occupied) {
    return dirs.filter(dir => occupied.has(elf.add(dir)))
}

function newPosition(elf, occupied) {
    let adjs = adjacents(allDirs, elf, occupied)
    if (adjs.length === 0) return null // if no adjacent elves, stay put

    let dir = proposeds.find(dirs => dirs.every(dir => !adjs.includes(dir)))
    return (dir && elf.add(dir[0])) || null
}

function round(elves, _round) {
    let occupied = new JSet(elves)
    let newPositions = elves.map(elf => newPosition(elf, occupied))
    let counts = new JSet(newPositions)
    let moved = 0

    for (let i = 0; i < elves.length; i++) {
        let p = newPositions[i]
        if (p === null || counts.count(p) > 1) continue
        moved++
        elves[i] = p
    }

    proposeds.rotateLeft()

    return moved
}

function logElves(elves) {
    elves.normalize2D()
    let {right, bottom} = elves.bounds2D()

    let _map = make2D(bottom + 1, right + 1, '.')
    elves.forEach(([c, r]) => _map[r][c] = '#')
    let rows = _map.map(row => row.join(''))
    log(rows.join('\n'))
    log('.')
}

// logElves(_elves)

for (let i = 0; i<10; i++) {
    round(_elves, i + 1)
    // logElves(_elves)
}

let { left, right, top, bottom } = _elves.bounds2D()

const width = right - left + 1
const height = bottom - top + 1
log(width, height, width * height - _elves.length)
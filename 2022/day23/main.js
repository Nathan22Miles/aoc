const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, runBFS, Comp } = require('../../utils')

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
function adjacents(elf, occupied) {
    return allDirs.filter(dir => occupied.has(key(elf.add(dir))))
}

function newPosition(elf, occupied) {
    let adjs = adjacents(elf, occupied)
    if (adjs.length === 0) return null // if no adjacent elves, stay put

    // Find the first direction in the proposeds that has no adjacent elves
    for (let dirs of proposeds) {
        if (dirs.every(dir => !adjs.includes(dir))) {
            return elf.add(dirs[0]) // move in the first direction
        }
    }

    return null
}

function key([r, c]) { return `${r}/${c}` }

function round(elves, _round) {
    let occupied = elves.map(key).toSet()
    let newPositions = elves.map(elf => newPosition(elf, occupied))
    let counts = (new Map()).countBy(newPositions.filter(p => p), p => key(p))
    let moved = 0

    for (let i = 0; i < elves.length; i++) {
        let p = newPositions[i]
        if (p === null || counts.get(key(p)) > 1) continue
        moved++
        elves[i] = p
    }

    proposeds.rotateLeft()

    return moved
}

function logElves(elves) {
    normalize(elves)
    let right = elves.map(([c, r]) => c).max()
    let bottom = elves.map(([c, r]) => r).max()

    let _map = make2D(bottom + 1, right + 1, '.')
    elves.forEach(([c, r]) => _map[r][c] = '#')
    let rows = _map.map(row => row.join(''))
    log(rows.join('\n'))
    log('.')
}

function normalize(elves) {
    let left = elves.map(([c, r]) => c).min()
    let top = elves.map(([c, r]) => r).min()
    elves.forEach(([c, r], i) => elves[i] = [c - left, r - top])
}

// logElves(_elves)

for (let i = 0; i<10; i++) {
    round(_elves, i + 1)
    // logElves(_elves)
}

let left = _elves.map(([c,r]) => c).min()
let right = _elves.map(([c,r]) => c).max()
let top = _elves.map(([c,r]) => r).min()
let bottom = _elves.map(([c,r]) => r).max()

const width = right - left + 1
const height = bottom - top + 1
log(width, height, width * height - _elves.length)
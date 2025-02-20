// Adapted from: github.com/juanplopes/advent-of-code-2022/blob/main/day16.py

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn } = require('../../utils')

// https://adventofcode.com/2022/day/18

process.chdir('/Users/nmiles/source/aoc/2022/day18')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let cubes = data.split('\n').map(line => line.split(',').map(Number))

function faces(cube) {
    let [x, y, z] = cube
    return [
        [x, y, z + .5],
        [x, y, z - .5],
        [x, y + .5, z],
        [x, y - .5, z],
        [x + .5, y, z],
        [x - .5, y, z],
    ].map(p => sfy(p))
}

let _faces = cubes.flatMap(faces)
let counts = (new Map()).countBy(_faces, x => x)

log([...counts.values()].filter(x => x === 1).length)

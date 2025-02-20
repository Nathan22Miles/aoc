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

function faces([x, y, z]) {
    return [
        [x, y, z + .5],
        [x, y, z - .5],
        [x, y + .5, z],
        [x, y - .5, z],
        [x + .5, y, z],
        [x - .5, y, z],
    ].map(p => sfy(p))
}

let toFaces = (cubesSet) => cubesSet.toArray().map(toXYZ).flatMap(faces)

// shift by 1 because 0 coordinates would require outs entries to have negative coordinates
let toXYZ = s => s.split(',').map(Number).map(x => x + 1) 

let cubes = data.split('\n').map(toXYZ) // [[x,y,z], ...]

let sxyz = ([x, y, z]) => `${x},${y},${z}`

let outOfBounds = (neighbor) => neighbor.some(x => x<0 || x>23)

let ins = new Set(cubes.map(sxyz))
let outs = new Set(['0,0,0'])

let directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]

let queue = [[0, 0, 0]]

// flood fill outside of the ins to create the outs
while (queue.length) {
    let [x, y, z] = queue.shift()

    for (let [dx, dy, dz] of directions) {
        let neighbor = [x + dx, y + dy, z + dz]
        
        if (outOfBounds(neighbor)) continue

        let key = sxyz(neighbor)
        if (ins.has(key)) continue
        if (outs.has(key)) continue
        
        outs.add(key)
        queue.push(neighbor)
    }
}

log(toFaces(outs).toSet().and(toFaces(ins).toSet()).size)

// 2515 too low






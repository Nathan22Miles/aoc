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

let toXYZ = s => s.split(',').map(Number)

let cubes = data.split('\n').map(toXYZ) // [[x,y,z], ...]

let sxyz = ([x, y, z]) => `${x},${y},${z}`

let outOfBounds = (neighbor) => neighbor.some(x => x<0 || x>22)

let ins = new Set(cubes.map(sxyz))
let outs = new Set(['0,0,0'])

let directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]

let queue = [[0, 0, 0]]

while (queue.length) {
    let [x, y, z] = queue.shift()

    for (let [dx, dy, dz] of directions) {
        let neighbor = [x + dx, y + dy, z + dz]
        assert(Number.isInteger(neighbor[0]))
        assert(Number.isInteger(neighbor[1]))
        assert(Number.isInteger(neighbor[2]))
        
        if (outOfBounds(neighbor)) continue

        let key = sxyz(neighbor)
        if (ins.has(key)) continue
        if (outs.has(key)) continue
        
        outs.add(key)
        assert(!outs.has('0'))
        queue.push(neighbor)
    }
}

let alls = new Set()
for (let x of rng(23)) {
    for (let y of rng(23)) {
        for (let z of rng(23)) {
            alls.add(sxyz([x, y, z]))
        }
    }
}

let mids = alls.andNot(ins).andNot(outs)
log(`size: ins=${ins.size} outs=${outs.size} mids=${mids.size}`)

assert(outs.and(ins).size === 0)
assert(outs.and(mids).size === 0)
assert(ins.and(mids).size === 0)
assert.strictEqual(alls.size, ins.size + outs.size + mids.size)

function surfaces(cubesSet) { // asSet
    let _faces = toFaces(cubesSet)
    let counts = (new Map()).countBy(_faces, x => x)
    let keys = [...counts.keys()]
    let _surfaces = keys.filter(key => counts.get(key) === 1)
    return _surfaces.toSet()
}

let inSurfaces = surfaces(ins)
let midSurfaces = surfaces(mids)
log(inSurfaces.size, midSurfaces.size, inSurfaces.size - midSurfaces.size)

let outSurfaces = surfaces(outs)
log(outSurfaces.and(inSurfaces).size)
log(sfy(inSurfaces.andNot(midSurfaces)
    .andNot(outSurfaces.and(inSurfaces))
    .toArray()))

// out.and(in) === in.andNot(mid)


// 2515 too low

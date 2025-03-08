const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')
const { resourceLimits } = require('worker_threads')

// https://adventofcode.com/2021/day/22
process.chdir('/Users/nmiles/source/aoc/2021/day22')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData2.txt', 'utf8')
// data = testData

// Based on methodology of https://github.com/sanraith/aoc2021/blob/main/src/solutions/day22.ts

class Cube {
    constructor(x1, x2, y1, y2, z1, z2) {
        this.x1 = x1
        this.x2 = x2
        this.y1 = y1
        this.y2 = y2
        this.z1 = z1
        this.z2 = z2
        this.volume = (x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1)
    }

    intersect(b) /* this,Cube => Cube | null */ {
        const x1 = Math.max(this.x1, b.x1)
        const x2 = Math.min(this.x2, b.x2)
        const y1 = Math.max(this.y1, b.y1)
        const y2 = Math.min(this.y2, b.y2)
        const z1 = Math.max(this.z1, b.z1)
        const z2 = Math.min(this.z2, b.z2)

        if (x1 > x2 || y1 > y2 || z1 > z2) { return null }
        return new Cube(x1, x2, y1, y2, z1, z2)
    }

    eq(b) {
        return this.x1 === b.x1 
            && this.x2 === b.x2 
            && this.y1 === b.y1 
            && this.y2 === b.y2 
            && this.z1 === b.z1 
            && this.z2 === b.z2
    }
}

function parse(line) {  // {state: boolean, cube: Cube}
    let [x0,x1,y0,y1,z0,z1] = line.match(/-?\d+/g).map(Number)
    let cmd = line.split(' ')[0]
    return {state: cmd === 'on', cube: new Cube(x0, x1, y0, y1, z0, z1)}
}

let steps = data.split('\n').map(parse)

class PunchedCube {
    constructor (cube, holes = []) {
        this.cube = cube // Cube
        this.holes = holes // PunchedCube[], holes have holes
    }

    remove(b) { // remove cube b from this PunchedCube
        // if not intersection, nothing to do
        const intersection = this.cube.intersect(b)
        if (!intersection) return

        // remove cube from existing holes
        this.holes.forEach(hole => {
            hole.remove(intersection)
        })

        // add cube as a new hole
        this.holes.push(new PunchedCube(intersection, []))
    }

    volume() {
        let volume = this.cube.volume
        for (const hole of this.holes) {
            volume -= hole.volume()
        }

        return volume
    }
}

function executeSteps(steps) {
    const punchedCubes = []
    steps.forEach(({ cube, state }, index) => {
        // remove from all previous PunchedCubes
        for (let pCube of punchedCubes) {
            pCube.remove(cube)
        }

        if (state) {
            // If adding a cube, add it as a new PunchedCube
            punchedCubes.push(new PunchedCube(cube, []))
        }
    })

    return punchedCubes.map(pCube => pCube.volume()).sum()
}

log(executeSteps(steps))
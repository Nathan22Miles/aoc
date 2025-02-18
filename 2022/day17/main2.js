// Adapted from: github.com/juanplopes/advent-of-code-2022/blob/main/day16.py

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn } = require('../../utils')

// https://adventofcode.com/2022/day/17

process.chdir('/Users/nmiles/source/aoc/2022/day17')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let _shapes = [
    [[2,0], [3,0], [4,0], [5,0]],
    [[2,1], [3,0], [3,1], [3,2], [4,1]],
    [[2, 0], [3, 0], [4, 0], [4, 1], [4,2]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[2, 0], [2,1], [3,0], [3,1]]
]

class Shape {
    constructor(xs, ys) {
        this.xs = xs
        this.ys = ys    
    }

    static iShape = 0
    static iShift = 0

    static nextShape() {
        let s = _shapes[Shape.iShape]
        Shape.iShape = (Shape.iShape + 1) % _shapes.length
        return new Shape(s.map(x => x[0]), s.map(x => x[1]))
    }

    static nextDir() {
        let d = data[Shape.iShift]
        Shape.iShift = (Shape.iShift + 1) % data.length
        return d === '<' ? -1 : 1
    }

    canShift(xDir, yDir, shapes) {
        if (xDir === -1 && this.xs.some(x => x === 0)) return false
        if (xDir === 1 && this.xs.some(x => x === 6)) return false
        if (yDir === -1 && this.ys.some(y => y === 1)) return false

        return !this.ps(xDir, yDir).some(p => shapes.has(p))
    }

    shift(xDir, yDir) {
        for (let i = 0; i < this.xs.length; ++i) {
            this.xs[i] += xDir
            this.ys[i] += yDir
        }
    }

    ps(xDir=0, yDir=0) {
        return this.xs.map((x, i) => x + xDir + 10*(this.ys[i] + yDir))
    }
}

let height = 0
let shapes = new Set()
let ds = []

for (let drop=0; drop<10000; ++drop) {
    let shape = Shape.nextShape()
    shape.shift(0, height+4)

    while (true) {
        let nextXDir = Shape.nextDir()
        if (shape.canShift(nextXDir, 0, shapes)) {
            shape.shift(nextXDir, 0)
        }

        if (!shape.canShift(0, -1, shapes)) { break }
        shape.shift(0, -1)
    }

    shape.ps().forEach(p => shapes.add(p))

    let newHeight = Math.max(height, shape.ys.max())
    ds.push(newHeight - height)
    height = newHeight
}

let pat = ds.slice(5000, 5020)
let finds = []

// find all the places that have the same 20-length pattern present at 5000
for (let i=0; i<ds.length-20; ++i) {
    let _pat = ds.slice(i, i+20)
    if (_pat.every((x, i) => x === pat[i])) {
        finds.push(i)
    }
}

let deltas = finds.deltas()

let first = finds[0]
let delta = deltas[0]

let t1 = ds.slice(0, first).sum()
let t2 = ds.slice(first, first+delta).sum()
let t2mult = Math.floor((1000000000000 - first) / delta)
let t2end = first + delta * t2mult
let t3 = ds.slice(first, first+1000000000000-t2end).sum()

let result = t1 + t2 * t2mult + t3
// testData result should be 1514285714288
log(result)

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn } = require('../../utils')

// https://adventofcode.com/2023/day/18

process.chdir('/Users/nmiles/source/aoc/2023/day18')

let myData = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// let data = testData
let data = myData

let table = {
    'U': [0, -1],
    'D': [0, 1],
    'L': [-1, 0],
    'R': [1, 0],
}

let plan = data.split('\n').map(r => {
    let [dir, rep, color] = r.split(' ') 
    return ({dir, rep: parseInt(rep), color, dy: table[dir][1], dx: table[dir][0]})
})

function pathType(p, i) {
    if (i % 2 === 1) return 'X'
    let pi = i - 1
    if (pi < 0) pi = plan.length - 1
    let ni = i + 1
    if (ni >= plan.length) ni = 0
    let prev = plan[pi].dir
    let next = plan[ni].dir
    let result = prev === next ? 'X' : 'Y'
    return result
}

plan.forEach((p, i) => { p.sym = pathType(p, i) })

let _x = 0
let _y = 0
let path = []

plan.forEach((p, i) => {
    let { sym, dx, dy, rep, color } = p
    for (let j = 0; j < rep; j++) {
        path.push({x: _x, y: _y, color, sym})
        _x += dx
        _y += dy
    }
});

let xMin = path.field('x').min()
let yMin = path.field('y').min()
path.forEach((p, i) => { p.x -= xMin; p.y -= yMin })

let xSize = path.field('x').max() + 1
let ySize = path.field('y').max() + 1

let grid = make2D(ySize, xSize, '.')

for (let p of path) {
    let { x, y, sym } = p
    grid[y][x] = sym
}

fs.writeFileSync('grid.txt', grid.joinjoin())

function insides(row) {
    row = row.jn()
    row = row.replace(/YX|XY/g, 'YY')
    let _insides = row.split(/X+/).odds()
    let result = _insides.replace(/Y/g, '').map(lengthFn).sum()
    return result
}

function paths(row) {
    let result = row.filter(cc => cc !== '.').length
    return result
}

let volume = grid.map(row => insides(row)+ paths(row)).log().sum()
log(volume)

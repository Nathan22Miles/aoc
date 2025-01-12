
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo } = require('../../utils')

// https://adventofcode.com/2023/day/18

process.chdir('/Users/nmiles/source/aoc/2023/day18')

let myData = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
let data = testData
// let data = myData

// five hexadecimal digits encode the distance in meters as a five-digit hexadecimal number. 
// The last hexadecimal digit encodes the direction to dig: 
// 0 means R, 1 means D, 2 means L, and 3 means U.

let table = {
    '3': 0,  // U
    '1': 1,  // D
    '2': 2,  // L
    '0': 3,  // R
}

let plan = data.split('\n').map(r => {
    // R 6 (#70c710)
    let [rep, dir] = [parseInt(r.slice(-7, -2), 16), table[r.slice(-2,-1)]]
    return ({dir, rep})
})

// log(plan.toString())

let [ U,D,L,R ] = [0,1,2,3] 
let dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]]

plan = [
    { dir: R, rep: 1 },
    { dir: D, rep: 1 },
    { dir: R, rep: 1 },
    { dir: D, rep: 1 },
    { dir: L, rep: 2 },
    { dir: U, rep: 2 },
]


let x = 0
let y = 0
let nx
let ny

let digs = []

for (let step of plan) {
    let {dir, rep} = step
    switch (dir) {
        case U:
            ny = y - rep
            digs.push([x, ny, x+1, y])
            y = ny
            break
        case D:
            ny = y + rep
            digs.push([x, y+1, x + 1, ny+1])
            y = ny
            break
        case L:
            nx = x - rep
            digs.push([nx, y, x, y + 1])
            x = nx
            break
        case R:
            nx = x + rep
            digs.push([x+1, y, nx + 1, y+1])
            x = nx
            break
        default:
            assert(false, `bad dir ${dir}`)
    }
}

log(digs.toString())

let xs = new Set()
xs._add(digs.map(d => d[0]))
xs._add(digs.map(d => d[2]))
xs = Array.from(xs).sort((a,b) => a - b)

let ys = new Set()
xs._add(digs.map(d => d[1]))
xs._add(digs.map(d => d[3]))
ys = Array.from(ys).sort((a, b) => a - b)

function isPointInPolygon(point, polygon) {
    let [x, y] = point
    let inside = false

    for (let i = 0; i < polygon.length; i++) {
        let [xi, yi] = polygon[i]
        let [xj, yj] = polygon[i + 1] ?? polygon[0]

        let intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
        if (intersect) {
            // log('intersect', sfy({x, y, xi, yi, xj, yj}))
            inside = !inside
        }
    }

    return inside
}

function inside(i, j) {
    let [x, y] = [xs[i], ys[j]]
    let [x2, y2] = [xs[i+1], ys[j+1]]
    const result = isPointInPolygon([(x + x2) / 2, (y + y2) / 2], poly)
    return result
}

function volume([i, j]) {
    if (!inside(i, j)) return 0
    return (xs[i+1] - xs[i]) * (ys[j+1] - ys[j])
}

// log(rng2(xs.length - 1, ys.length - 1).map(([i,j]) => [i,j, inside(i,j)]).toString())

let result = rng2(xs.length-1, ys.length-1)
        .map(volume)
        .sum()

log(result)
// log(result - 952408144115)
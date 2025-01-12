
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo } = 
            require('../../utils')

// https://adventofcode.com/2023/day/18

process.chdir('/Users/nmiles/source/aoc/2023/day18')

let myData = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// let data = testData
let data = myData

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

let x = 1
let y = 0

let vs = [[x,y]]

for (let step of plan) {
    let {dir, rep} = step
    switch (dir) {
        case U:
            y = y - rep
            vs.push([x+1, y])
            break
        case D:
            y = y + rep
            vs.push([x+1, y])
            break
        case L:
            x = x - rep
            vs.push([x+1, y])
            break
        case R:
            x = x + rep
            vs.push([x+1, y])
            break
        default:
            assert(false, `bad dir ${dir}`)
    }
}

function calculatePolygonArea(vertices) {
    let area = 0
    const n = vertices.length

    for (let i = 0; i < n; i++) {
        let [x1, y1] = vertices[i]
        let [x2, y2] = vertices[(i + 1) % n]
        area += x1 * y2 - x2 * y1
    }

    return Math.abs(area) / 2
}

let perimeter = plan.field('rep').sum()

let result = calculatePolygonArea(vs) + perimeter/2 + 1
log(result, result - 952408144115)
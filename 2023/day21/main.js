
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd } = require('../../utils')

// https://adventofcode.com/2023/day/21

process.chdir('/Users/nmiles/source/aoc/2023/day21')

let myData = fs.readFileSync('data.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
// let data = testData
data = myData

let _m = new Maze(data, { addBorder: true, borderChar: '#' })
let { m, r, c, fr } = _m
let { U, D, L, R } = _m.dirs()

let next = [ 
    [U, U], [U, L], [U, R], 
    [D, D], [D, L], [D, R], 
    [L, L], [L, U], [L, D], 
    [R, R], [R, U], [R, D] ]

let gardens = new Set(_m.ps)

let neighbors = new Map()
for (let g of gardens) {
    for (let [d1, d2] of next) {
        let p1 = g + d1
        if (!gardens.has(p1)) continue
        let p2 = g + d1 + d2
        if (!gardens.has(p2)) continue

        neighbors.push(g, p2)
    }
}

let visited = new Set()
visited.add(_m.find('S'))

for (let i=0; i<32; ++i) {
    let _visited = new Set()
    for (let v of visited) {
        for (let n of neighbors.get(v)) {
            _visited.add(n)
        }
    }
    visited = _visited
    log(visited.size)
}

// log(visited.size)
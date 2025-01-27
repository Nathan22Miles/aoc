
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn } = require('../../utils')

// https://adventofcode.com/2022/day/12

process.chdir('/Users/nmiles/source/aoc/2022/day12')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let _m = new Maze(data, { addBorder: true, borderChar: '#' })

let { m, r, c, fr } = _m
let { U, D, L, R, ds, iU, iD, iL, iR } = _m.dirs()
let dirNames = ['U', 'D', 'L', 'R']

let S = _m.find('S')
m[S] = 'a'
let E = _m.find('E')
m[E] = 'z'

function canGo(p, q) { 
    if (!fr(q)) return false
    return m[q].charCodeAt(0) <= m[p].charCodeAt(0) + 1 
}

// assert(canGo(S, S + U) === false)
// assert(canGo(S, S + D) === true)
// assert(canGo(S+2, S+3) === false)

function nexts(p) {
    return [U, D, L, R].flatMap(dir => {
        let q = p + dir
        return canGo(p, q) ? q : []
    })
}

let g = new Graph()

function buildGraph() {
    for (let p of _m.ps) {
        for (let q of nexts(p)) {
            g.addEdge(p, q, 1)
        }
    }
}

buildGraph()

let { path } = g.findShortestPath(S, E)
log(path, path.length - 1)

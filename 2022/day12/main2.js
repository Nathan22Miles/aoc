
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

/** Return a list of positions starting with p and following the directions in pathDirs.
 * If any position is not in the maze or is '#', return an empty list.
 */
function frPath(p, pathDirs) {
    if (!Array.isArray(pathDirs)) pathDirs = [pathDirs]

    let path = [p]
    for (let dir of pathDirs) {
        p = p + dir
        if (!fr(p)) return []
        path.push(p)
    }
    
    return path
}

function height(p) { return m[p].charCodeAt(0) }

let cost = (p, q) => (height(q) >= height(p) - 1) ? 1 : Infinity

let g = new Graph()

function buildGraph() {
    _m.ps.crosses([U, D, L, R]).forEach(([p, dir]) => {
        let path = frPath(p, [dir])
        let q = path.last()
        if (!q) return
        g.addEdge(p, q, cost(p, q))})
}

buildGraph()

let { path: shortestPath, distances } = g.findShortestPath(E, S)

log(_m.ps.filter(p => m[p] === 'a').map(p => distances[p]).min())

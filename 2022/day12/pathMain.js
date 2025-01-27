
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
assert(S, 'no S')
m[S] = '.'
let E = _m.find('E')
assert(E, 'no E')
m[E] = '.'

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

// cost to move from p to q.
// Return Infinity if this is not allwed.
let cost = (p, q) => 1

// Build a directed graph assuming we can move U, D, L, R from each position
// that is 'free' (not a wall, #).
function build_UDLR_graph(_cost) {
    let _g = new Graph()

    _m.ps.crosses([U, D, L, R]).forEach(([p, dir]) => {
        let path = frPath(p, [dir])
        let q = path.last()
        if (!q) return
        // if _cost is Infinite, will NOT add an edge
        _g.addEdge(p, q, _cost(p, q))
    })

    log('build_UDLR_graph vertices count', _g.aList.size)

    return _g
}

let g = build_UDLR_graph(cost) // build directed graph based on UDLR moves on maze _m

// path = [p1, p2, ...] shortest (least cost) path from S to E
// distances[q] = distance (total cost) from S to q
let { path, distances } = g.findShortestPath(S, E)

log('path', path)
log('distances', distances)

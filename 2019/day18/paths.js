const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2019/day/18
process.chdir('/Users/nmiles/source/aoc/2019/day18')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
data = testData

let maze = new Maze(data, { addBorder: false })

let { U, D, L, R } = maze.dirs()
let { m } = maze

let keys = new Set()
maze.m.forEach(cc => { if (cc >='a' && cc <= 'z') {
    keys.add(cc)
}})

let offset = 1
let keyBit = new Map()

for (let key of keys) {
    keyBit.set(key, offset)
    keyBit.set(key.toUpperCase(), offset)
    offset *= 2
}

function isDoorKey(key) { return key[0] >= 'a' && key[0] <= 'z' }
function isDoor(key) { return key[0] >= 'A' && key[0] <= 'Z' }

function buildGraph() {
    let graph = new Map()

    for (let p of maze.ps) {
        for (let dir of [U, D, L, R]) {
            const np = p + dir
            let cc = m[np]
            if (cc == '#') continue // wall
            graph.push(p, np)
        }
    }

    return graph
}

function bfs(graph, start) {
    let distances = new Map()
    let queue = [[start, 0]] // [node, distance]
    let visited = new Set()

    while (queue.length > 0) {
        let [p, dist] = queue.shift()
        if (visited.has(p)) continue
        visited.add(p)

        for (let neighbor of graph.get(p) || []) {
            if (visited.has(neighbor)) continue

            if (m[neighbor] === '.') {
                queue.push([neighbor, dist + 1])
            }
            else {
                distances.set(m[neighbor], dist+1)
            }
        }
    }

    return distances
}

// graph2 contains only @, doors, and keys.
function buildGraph2(graph) {
    let graph2 = new Map()
    for (let p of maze.ps) {
        if (m[p] === '.') continue
        graph2.set(m[p], bfs(graph, p))
    }
    return graph2
}

let graph = buildGraph()

// graph2 doorKey|door => (doorKey|door => distance)
let graph2 = buildGraph2(graph)

// key = mm_steps_node_keys
//     mm number of missing keys
//     steps = steps taken so far
//     node = current doorKey or door
//     keys = keys collected so far (integer encoding)

function makeId(mm, steps, node, keys) {
    return `${pad(mm, 2, '0')}_${pad(steps, 6, '0')}_${node}_${keys}`
}

function splitId(id) {
    let [mm, steps, node, keys] = id.split('_')
    mm = parseInt(mm)
    steps = parseInt(steps)
    keys = parseInt(keys)
    return { mm, steps, node, keys }
}

let minDist = new Map() // `${node}_${keys}` => min distance

class Element {
    // Equal elements must have the same key.
    // Elements with lower keys are preferentially retained.
    constructor(id) { 
        this.id = id
    }

    // return [Element] - elements reachable next round from this element.
    nexts() {
        let ns = []
        let { mm, steps, node, keys } = splitId(this.id)

        for (let [next, dist] of (graph2.get(node) || [])) {
            // let dist = graph2.get(node).get(next)
            let _mm = mm
            let _keys = keys

            if (next >= 'a' && next <= 'z') {
                if ((keyBit.get(next) & keys) === 0) {
                    --_mm
                    _keys = _keys | keyBit.get(next)
                }
            }
            else if (next >= 'A' && next <= 'Z') {
                if ((keyBit.get(next) & keys) === 0) continue
            } else if (next === '@') {
            }

            let mdKey = `${next}_${_keys}`
            let md = minDist.get(mdKey) ?? Infinity
            if (steps + dist >= md) continue
            minDist.set(mdKey, steps + dist)

            ns.push(new Element(makeId(_mm, steps + dist, next, _keys)))
        }

        // minDist.log()
        return ns
    }

    found() {
        // return key if this element is the goal, otherwise ''.
        return this.id.startsWith('00_') ? this.id : ''
    }
}

/* Run breadth first search until element.done().
 * breadth: Number of elements to retain in each round.
 */
function runBFS(initialElement, breadth) {
    let todo = new PriorityQueue()
    todo.enqueue(initialElement, initialElement.id)

    for (let round = 0; ; ++round) {
        // log('round=', round)
        let _todo = new PriorityQueue()
        let processed = 0
        let previousId = ''

        while (processed < breadth && !todo.isEmpty()) {
            let { vertex: element, priority: id } = todo.dequeue()
            if (element.found()) return element.id

            if (id === previousId) { continue }
            previousId = id

            ++processed
            for (let nextElement of element.nexts(round)) {
                // log(nextElement.id)
                _todo.enqueue(nextElement, nextElement.id)
            }
        }

        todo = _todo
    }
    log('failed')
}

// 136
let element = new Element(makeId(keys.size, 0, '@', 0))

log(runBFS(element, 100000))

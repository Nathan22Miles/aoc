const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')
const { emitKeypressEvents } = require('readline')

// https://adventofcode.com/2019/day/18
process.chdir('/Users/nmiles/source/aoc/2019/day18')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData // shortest path 136 steps

let maze = new Maze(data, { addBorder: false })

let { U, D, L, R } = maze.dirs()
let { m } = maze

let keys = new Set()
maze.m.forEach(cc => { if (cc >='a' && cc <= 'z') {
    keys.add(cc)
}})

let keyCount = keys.size

// key = mm_p_keys
//     mm number of missing keys
//     p current position in maze
//     keys = keys collected so far

function addKey(keys, key) {
    if (keys.includes(key)) return keys
    // maybe we should sort keys here?
    keys += key
    return keys
}

class Element {
    // Equal elements must have the same key.
    // Elements with lower keys are preferentially retained.
    constructor(p, keys, steps) { 
        this.key = `${pad(keyCount-keys.length, 2, '0')}_${p}_${keys}_${steps}`
    }

    // return [Element] - elements reachable next round from this element.
    nexts(round) {
        let [mm, p, keys] = this.key.split('_')
        p = parseInt(p)

        let ns = []

        for (let dir of [U, D, L, R]) {
            const np = p + dir
            let cc = m[np]
            if (cc === '#') continue // wall
            let _keys = keys
            if (cc >= 'a' && cc <= 'z') {
                _keys = addKey(keys, cc)
            }
            if (cc >= 'A' && cc <= 'Z') {
                if (!keys.includes(cc.toLowerCase())) continue // missing key
            }
            ns.push(new Element(np, _keys, round+1))
        }

        return ns
    }

    found() {
        // return key if this element is the goal, otherwise ''.
        return this.key.startsWith('00_') ? this.key : ''
    }
}

/* Run breadth first search until element.done().
 * breadth: Number of elements to retain in each round.
 */
function runBFS(initialElement, breadth) {
    let todo = new PriorityQueue()
    todo.enqueue(initialElement, initialElement.key)

    for (let round = 0; ; ++round) {
        log('round=', round)
        let _todo = new PriorityQueue()
        let processed = 0
        let previousKey = ''
        let first = true

        while (processed < breadth && !todo.isEmpty()) {
            let { vertex: element, priority: key } = todo.dequeue()
            if (first) {
                first = false
                log(key)
            }
            if (key === previousKey) { continue }
            previousKey = key

            ++processed
            for (let nextElement of element.nexts(round)) {
                // if (nextElement.key.includes('_ab_')) { log(`---${nextElement.key}`)}
                if (nextElement.found()) return nextElement.key
                _todo.enqueue(nextElement, nextElement.key)
            }
        }

        todo = _todo
    }
}

let element = new Element(maze.find('@'), '', 0)

log(runBFS(element, 100000))


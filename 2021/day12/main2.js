const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')

// https://adventofcode.com/2021/day/12
process.chdir('/Users/nmiles/source/aoc/2021/day12')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let lcs = new Set()

let map = new Map()
data.split('\n').forEach((line, y) => {
    let [a, b] = line.split('-')
    // if a is entirely lowercase, add it to the lcs
    if (a === a.toLowerCase()) lcs.add(a)
    if (b === b.toLowerCase()) lcs.add(b)

    map.push(a, b)
    map.push(b, a)
})

let terminals = new JSet()

function hasDoubleLc(p) {
    let jset = new JSet(p.filter(n => lcs.has(n)))
    return [...jset].some(v => jset.count(v) > 1)
}

function canAdd(p, n) {
    if (n === 'start') return false
    if (n === 'end') return true
    if (!lcs.has(n)) return true
    if (!p.includes(n)) return true
    if (hasDoubleLc(p)) return false
    return true
}

// assert(!hasDoubleLc(['fs', 'he']))
// assert(hasDoubleLc(['he', 'fs', 'he']))

function nextNodes(p) {
    return map.get(p.last()).filter(n => canAdd(p, n))
}

function extend(paths) {
    while (paths.size > 0) {
        log('paths', paths.size)
        let newPaths = new JSet()
        for (let p of paths) {
            let nexts = nextNodes(p)
            for (let n of nexts) {
                let next = [...p,n]
                if (n === 'end') {
                    terminals.add(next)
                } else {
                    newPaths.add(next)
                }
            }
        }
        paths = newPaths
    }
}

extend(new JSet([['start']]))

log(terminals.size)
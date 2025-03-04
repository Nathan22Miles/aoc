const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')

// https://adventofcode.com/2021/day/14
process.chdir('/Users/nmiles/source/aoc/2021/day14')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData
let [seq, _subs] = data.split('\n\n')

let sub = _subs.split('\n').toMap(line => line.split(' ')[0], line => line.split(' ')[2])

let counts = new Map()
for (let cc of seq) { 
    counts.tally(cc) 
}

let pairs = new Map()
for (let i = 0; i < seq.length - 1; ++i) { pairs.tally(seq.slice(i, i + 2)) }

for (let i = 0; i < 40; ++i) {
    let newPairs = new Map()
    for (let [k, v] of pairs) {
        let cNew = sub.get(k)
        counts.tally(cNew, v)
        newPairs.tally(k.slice(0, 1) + cNew, v)
        newPairs.tally(cNew + k.slice(1), v)
    }
    pairs = newPairs
}

let v = [...counts.values()]
log(v.max() - v.min())
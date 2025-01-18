
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
let { m, r, c } = _m
log(r, c, m[0].length)

// points at which path can enter a maze instance
let entriesRC = [
    [1, 1], [66, 1], [131, 1],
    [1, 66], [66, 66], [131, 66],
    [1, 131], [66, 131], [131, 131],
]

let entries = entriesRC.map(rc => _m.rc2p(rc)) // p's

let oddCount = doSteps(entries[4], 265)
let evenCount = doSteps(entries[4], 266)

let doubleStride = 131+131

let stride = 131 // number steps to cross a maze instance
let halfStride = 66 // number of steps from middle to edge+1

let totalSteps = 26501365

function doSteps(pStart, stepCount) {
    let vs = new Set([pStart])

    rng(stepCount, _ => {
        let _vs = new Set()
        vs.forEach(v => _vs._add(_m.neighbors(v, 1)))
        vs = _vs
    })

    return vs.size
}

function _calcCount(entry, stepCount) {
    let result = doSteps(entries[entry], stepCount)
    return result
}
const calcCount = memoize(_calcCount)

function verticalCount(entry, stepCount) {
    let _count = 0
    let doubleStrides = Math.floor(stepCount / doubleStride)
    _count += doubleStrides * (oddCount + evenCount)
    
    stepCount = stepCount % doubleStride
    for (; stepCount > 0; stepCount -= stride) {
        _count += calcCount(entry, stepCount % doubleStride)
    }

    return _count
}

let count = 0
count += oddCount // middle middle

count += verticalCount(1, totalSteps - halfStride) // lower middle
count += verticalCount(7, totalSteps - halfStride) // upper middle

let stepCount = totalSteps - halfStride

for (; stepCount > 0; stepCount -= stride) {
    count += calcCount(3, stepCount % doubleStride) // right from middle
    count += calcCount(5, stepCount % doubleStride) // left from middle

    count += verticalCount(0, stepCount - halfStride) // lower right
    count += verticalCount(2, stepCount - halfStride) // lower left
    count += verticalCount(6, stepCount - halfStride) // upper right
    count += verticalCount(8, stepCount - halfStride) // upper left
}

log(count)

// 608193767979991 correct


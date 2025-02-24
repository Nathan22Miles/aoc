// adapted from https://topaz.github.io

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, runBFS, Comp } = require('../../utils')

// https://adventofcode.com/2022/day/21
process.chdir('/Users/nmiles/source/aoc/2022/day21')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

// root: pppw + sjmn
// pppw: 1

Comp.parse(data, /(?<id>\w+): (?<input1>\S+) ?(?<type>\S)? ?(?<input2>\S+)?/)

function fold(id) {
    let comp = Comp.get(id)
    assert(comp)
    let { type, inputs } = comp
    let [input1, input2] = inputs

    if (!type) { return input1 }

    return `(${fold(input1)}${type}${fold(input2)})`
}

// paste this output into live.sympy.org to get answer
log(fold('root'))


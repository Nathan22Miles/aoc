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

function eval(id) {
    let comp = Comp.get(id)
    assert(comp)
    let { type, inputs } = comp
    let [input1, input2] = inputs

    if (!type) {
        // throw an error if input1 is not all decimal digits
        if (input1.match(/\D/)) {
            throw new Error('Unknown input: ' + input1)
        }
        return parseInt(input1)
    }

    switch (type) {
        case '+':
            return eval(input1) + eval(input2)
        case '-':
            return eval(input1) - eval(input2)
        case '*':
            return eval(input1) * eval(input2)
        case '/':
            return eval(input1) / eval(input2)
        default:
            throw new Error('Unknown type: ' + type)
    }
}

function dependent(comp) {
    if (!comp.type) return false
    if (comp.inputs.includes('humn')) return true
    return comp.inputs.some(input => dependent(Comp.get(input)))
}

log('op components', Comp.comps().filter(c => c.type).length)
log('dependent components', Comp.comps()
        .map(c => dependent(c))
        .filter(Boolean)
        .length)

// log(eval('root'))


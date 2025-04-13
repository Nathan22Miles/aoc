const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2019/day/2
process.chdir('/Users/nmiles/source/aoc/2019/day2')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

// day 2, 5, 9


const wall = 0 // position has not changed.
const moved = 1 // position has changed.
const oxy = 2 // oxygen found

let _mem = data.split(',').map(parseIntFn)
for (let i = 0; i < 10; i++) { _mem.push(0) }

function xeq(ip, mem) {
    let [op, arg1, arg2, out] = mem.slice(ip, ip + 4)
    // log([op, arg1, arg2, out])
    switch (op) {
        case 1:
            mem[out] = mem[arg1] + mem[arg2]
            return ip+4
        case 2:
            mem[out] = mem[arg1] * mem[arg2]
            return ip + 4
        case 99:
            return -1
        default:
            return -2
            // throw new Error(`Unknown opcode ${pc}`)
    }
}

function run(v1, v2) {
    let mem = _mem.slice()
    mem[1] = v1
    mem[2] = v2

    let ip = 0
    while (true) {
        ip = xeq(ip, mem)
        if (ip >= 0) continue
        if (ip === -1) return mem[0]
        return null
    }
}

for (let v1=0; v1<=99; v1++) {
    for (let v2=0; v2<=99; v2++) {
        let result = run(v1, v2)
        if (result === 19690720) {
            log(`found: ${v1} ${v2} ${100*v1+v2}`)
            break
        }
    }
}


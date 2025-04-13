const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2019/day/5
process.chdir('/Users/nmiles/source/aoc/2019/day5')

let data = fs.readFileSync('data.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

// data = '1002,4,3,4,33'
// data = '3,0,4,0,99'

// day 5, 9


const wall = 0 // position has not changed.
const moved = 1 // position has changed.
const oxy = 2 // oxygen found

let inputs = [1]
let inp = 0

let _mem = data.split(',').map(parseIntFn)
for (let i = 0; i < 10; i++) { _mem.push(0) }

function argModes(op) {
    let modes = ('00000'+op.toString()).split('').slice(0,-2).reverse().map(parseIntFn)
    return modes
}

function getArg(mem, ip, mode, i) {
    let arg = mem[ip + 1 + i]
    if (mode === 0) {
        return mem[arg]
    } else if (mode === 1) {
       return arg
    } else {
        throw new Error(`Unknown mode ${mode[i]}`)
    }
}

function xeq(ip, mem) {
    let op = mem[ip] % 100
    let modes = argModes(mem[ip])
    let arg1, arg2, out
    // log([op, arg1, arg2, out])
    switch (op) {
        case 1:
            arg1 = getArg(mem, ip, modes[0], 0)
            arg2 = getArg(mem, ip, modes[1], 1)
            out = getArg(mem, ip, 1, 2)
            mem[out] = arg1 + arg2
            return ip+4
        case 2:
            arg1 = getArg(mem, ip, modes[0], 0)
            arg2 = getArg(mem, ip, modes[1], 1)
            out = getArg(mem, ip, 1, 2)
            mem[out] = arg1 * arg2
            return ip + 4
        case 3:
            arg1 = getArg(mem, ip, 1, 0)
            mem[arg1] = inputs[inp]
            inp++
            return ip + 2
        case 4:
            arg1 = getArg(mem, ip, modes[0], 0)
            log(`Output: ${arg1}`)
            return ip + 2
        case 99:
            return -1
        default:
            return -2
            // throw new Error(`Unknown opcode ${pc}`)
    }
}

function run() {
    let mem = _mem.slice()

    let ip = 0
    while (true) {
        ip = xeq(ip, mem)
        if (ip >= 0) continue
        if (ip === -1) return mem[0]
        return null
    }
}

run()




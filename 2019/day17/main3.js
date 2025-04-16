const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2019/day/17
process.chdir('/Users/nmiles/source/aoc/2019/day17')

let data = fs.readFileSync('data.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

// data = '1002,4,3,4,33'
// data = '3,0,4,0,99'
// data = '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99'
// data = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99'
// data = '1102,34915192,34915192,7,4,7,99,0' // 1219070632396864
// data = '104,1125899906842624,99'

// day 5, 9

let inputs = []
let inp = 0
let outputs = []

let dotrace = false
let traces = []

function trace(str) {
    traces.push(str)
}

let memory = new Map()

function getMem(ip) {
    assert(ip >= 0)
    if (memory.has(ip)) {
        return memory.get(ip)
    } else {
        return 0
    }
}

function setMem(ip, val) {
    assert(ip >= 0)
    memory.set(ip, val)
}

let _mem = data.split(',').map(parseIntFn)
for (let i = 0; i < _mem.length; i++) { setMem(i, _mem[i]) }

setMem(0, 2) // part 2

traceMem = true

function argModes(op) {
    let modes = ('00000'+op.toString()).split('').slice(0,-2).reverse().map(parseIntFn)
    return modes
}

let base = 0

function getArg(ip, modes, i, isOutput) {
    let mode = modes[i]

    if (isOutput) {
        // output
        if (mode === 0) {
            return getMem(ip + 1 + i)
        } else if (mode === 1) {
            throw new Error(`Immediate mode not allowed for output`)
        } else if (mode === 2) {
            return base + getMem(ip + 1 + i)
        } else {
            throw new Error(`Unknown mode ${mode[i]}`)
        }
    }

    let arg = getMem(ip + 1 + i)
    if (mode === 0) {
        return getMem(arg)
    } else if (mode === 1) {
        return arg
    } else if (mode === 2) {
        return getMem(base + arg)
    } else {
        throw new Error(`Unknown mode ${mode[i]}`)
    }
}

function fmtArgs(ip, modes, len) {
    let args = []
    for (let i = 0; i < len; i++) {
        let mode = modes[i]
        if (mode === 0) {
            args.push(`${getMem(ip + 1 + i)}`)
        } else if (mode === 1) {
            args.push(`#${getMem(ip + 1 + i)}`)
        } else if (mode === 2) {
            args.push(`[${base}]+${getMem(ip + 1 + i)}`)
        }
    }

    return args.join(', ')
}

let count = 0

function xeq(ip) {
    ++count
    // if (count % 10000 === 0) { log (count/10000) }
    
    let op = getMem(ip) % 100
    let modes = argModes(getMem(ip))
    let arg1, arg2, out
    // log([op, arg1, arg2, out])
    switch (op) {
        case 1:
            arg1 = getArg(ip, modes, 0)
            arg2 = getArg(ip, modes, 1)
            out = getArg(ip, modes, 2, true)
            // trace(`${ip}: add ${fmtArgs(ip, modes, 3)} // [${out}] = ${arg1} + ${arg2}`)
            
            setMem(out, arg1 + arg2)
            return ip+4
        case 2:
            arg1 = getArg(ip, modes, 0)
            arg2 = getArg(ip, modes, 1)
            out = getArg(ip, modes, 2, true)
            // trace(`${ip}: mult ${fmtArgs(ip, modes, 3)} //  [${out}] = ${arg1} * ${arg2}`)

            setMem(out, arg1 * arg2)
            return ip + 4
        case 3: // input
            out = getArg(ip, modes, 0, true)
            const input = inputs.shift()
            setMem(out, input)
            // trace(`${ip}: input ${fmtArgs(ip, modes, 1)} // [${out}] = ${input}`)
            return ip + 2
        case 4: // output
            arg1 = getArg(ip, modes, 0)
            // trace(`${ip}: output ${fmtArgs(ip, modes, 1)} // ${arg1}`)
            outputs.push(arg1)
            return ip + 2
        case 5: // jump-if-true: if the first parameter is non-zero, ip = second parameter.
            arg1 = getArg(ip, modes, 0)
            arg2 = getArg(ip, modes, 1)
            // trace(`${ip}: jmp-true ${fmtArgs(ip, modes, 2)} // ${arg1} => ${arg2}`)

            if (arg1 !== 0) {
                return arg2
            } else {
                return ip + 3
            }
        case 6: // jump-if-false: if the first parameter is zero, ip = second parameter.
            arg1 = getArg(ip, modes, 0)
            arg2 = getArg(ip, modes, 1)
            // trace(`${ip}: jmp-false ${fmtArgs(ip, modes, 2)} // ${arg1} => ${arg2}`)

            if (arg1 === 0) {
                return arg2
            } else {
                return ip + 3
            }
        case 7: // is-less-than: if the first parameter is less than the second parameter, 
            // it stores 1 in the position given by the third parameter.Otherwise, it stores 0.
            arg1 = getArg(ip, modes, 0)
            arg2 = getArg(ip, modes, 1)
            out = getArg(ip, modes, 2, true)
            // trace(`${ip}: lt ${fmtArgs(ip, modes, 3)} // ${arg1}, ${arg2}`)

            setMem(out, arg1 < arg2 ? 1 : 0)
            return ip + 4
        case 8: // is-equal: if the first parameter is less than the second parameter, arg1 = getArg(ip, modes[0], 0)
                // it stores 1 in the position given by the third parameter.Otherwise, it stores 0.
            arg1 = getArg(ip, modes, 0)
            arg2 = getArg(ip, modes, 1)
            out = getArg(ip, modes, 2, true)
            // trace(`${ip}: eq ${fmtArgs(ip, modes, 3)} // [${out}] = ${arg1} === ${arg2}`)

            setMem(out, arg1 === arg2 ? 1 : 0)
            return ip + 4
        case 9: // adjust relative base
            arg1 = getArg(ip, modes, 0)
            base += arg1
            // trace(`${ip}: incbase ${fmtArgs(ip, modes, 1)} // +${arg1}; base = ${base}`)
            
            return ip + 2
        case 99:
            fs.writeFileSync('trace.txt', traces.join('\n'), 'utf8')
            return -1
        default:
            log(`Unknown opcode ${op} at ${ip}`)
            // log(`Unknown opcode ${op} at ${ip}`)
            return -2
            // throw new Error(`Unknown opcode ${pc}`)
    }
}

function run() {
    let ip = 0
    outputs = []

    while (true) {
        ip = xeq(ip)
        if (ip < 0) break
    }
    log(outputs.slice(-1)[0])
}

inputs = `A,B,A,C,A,B,C,B,C,A
L,12,R,4,R,4,L,6
L,12,R,4,R,4,R,12
L,10,L,6,R,4
n
`.split('').map(cc => cc.charCodeAt(0))

run()
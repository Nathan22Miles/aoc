const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')
const { clear } = require('console')

let vars = 'abcdefghijklmn'.split('')

// https://adventofcode.com/2021/day/24
process.chdir('/Users/nmiles/source/aoc/2021/day24')

let data = fs.readFileSync('data.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let target = new JMap([['w',0], ['x',1], ['y',2], ['z',3]])

function toTarget(s) { return target.get(s) ?? -1 }

class Model  {
    vals = ['0', '0', '0', '0']

    toVal(s) {
        let t = toTarget(s)
        if (t === -1) return s
        return this.vals[t]
    }

    add(a1, a2) {
        let t1 = toTarget(a1)
        let _a1 = this.vals[t1]
        let _a2 = this.toVal(a2)

        this.vals[t1] = `(${_a1} + ${_a2})`
    }

    mul(a1, a2) {
        let t1 = toTarget(a1)
        if (a2 === '0') {
            this.vals[t1] = '0'
            return
        }

        let _a1 = this.vals[t1]
        let _a2 = this.toVal(a2)

        this.vals[t1] = `(${_a1} * ${_a2})`
    }

    mod(a1, a2) {
        let t1 = toTarget(a1)
        let _a1 = this.vals[t1]
        let _a2 = this.toVal(a2)

        this.vals[t1] = `(${_a1} mod ${_a2})`
    }

    div(a1, a2) {
        let t1 = toTarget(a1)
        let _a1 = this.vals[t1]
        let _a2 = this.toVal(a2)

        this.vals[t1] = `(${_a1} div ${_a2})` // integer division
    }

    eql(a1, a2) {
        let t1 = toTarget(a1)
        let _a1 = this.vals[t1]
        let _a2 = this.toVal(a2)

        this.vals[t1] = `(if ${_a1} = ${_a2} then 1 else 0 endif)`
    }
}

let model = new Model()

function xeq(seq, i) {
    model.vals[0] = vars[i]
    model.vals[3] = i === 0 ? '0' : `z${i}`

    let instrs = seq.split('\n').map(s => s.split(' '))
    for (let [op, a1, a2] of instrs) {
        if (op === 'add') model.add(a1, a2)
        if (op === 'mul') model.mul(a1, a2)
        if (op === 'mod') model.mod(a1, a2)
        if (op === 'div') model.div(a1, a2)
        if (op === 'eql') model.eql(a1, a2)
    }
    return model.vals[3]
}

let lines = []
vars.forEach(v => {
    lines.push(`var 1..9: ${v};`)
})
rng(14).forEach(i => {
    lines.push(`var int: z${i+1};`)
})

let seqs = data.split('inp w\n').slice(1)
seqs.forEach((seq, i) => { lines.push(`constraint z${i+1} = ${xeq(seq, i)};`) })

lines.push(`constraint z14 = 0;`)

// In the ide, I had to manually restrict optimization to a 4 digits at a time (starting at high end)
// to get the solution.

lines.push(`solve maximize a*10000000000000 + b*1000000000000 + c*100000000000 + d*10000000000 + e*1000000000 + f*100000000 + g*10000000 + h*1000000 + i*100000 + j*10000 + k*1000 + l*100 + m*10 + n;`)

// part 2
// solve minimize a*10000000000000 + b*1000000000000 + c*100000000000 + d*10000000000 + e*1000000000 + f*100000000 + g*10000000 + h*1000000 + i*100000 + j*10000 + k*1000 + l*100 + m*10 + n;

fs.writeFileSync('model.mzn', lines.join('\n'))

// used MiniZinc coin-bc model to solve

// smallest 92928914911991  too high

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')
const { sign } = require('crypto')

// https://adventofcode.com/2019/day/16
process.chdir('/Users/nmiles/source/aoc/2019/day16')

let data = fs.readFileSync('data.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

// data = '80871224585914546619083218645595' // becomes 24176176
// data = '12345678'
// data = '80871224585914546619083218645595'

let signal = data.split('').map(Number)

function *iter(pos, len) {
    let cnt = 0
    let pat = [0, 1, 0, -1]
    let jPat = 0
    let kRepeat = pos + 1
    let first = true

    while (true) {
        for (let k=0; k < kRepeat; k++) {
            if (!first) {
                yield pat[jPat]

                ++cnt
                if (cnt >= len) {
                    return
                }
            }
            first = false
        }
        jPat = (jPat + 1) % 4
    }
}

function phase(s) {
    let len = s.length
    let out = []
    for (let i=0; i < len; i++) {
        let sum = 0
        let it = iter(i, len)
        for (let j=0; j < len; j++) {
            sum += s[j] * it.next().value
        }
        out.push(Math.abs(sum) % 10)
    }
    return out
}

for (let i=0; i < 100; i++) {
    signal = phase(signal)
}

log(signal.slice(0, 8).join(''))
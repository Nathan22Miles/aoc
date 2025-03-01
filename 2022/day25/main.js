const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')

// https://adventofcode.com/2022/day/25
process.chdir('/Users/nmiles/source/aoc/2022/day25')

let abs = Math.abs

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData


let pMaxs = rng(20)
let ps = rng(20)
for (let i = 0; i < 20; ++i) {
    pMaxs[i] = rng(i+1).map(x => 2 * (5 ** x)).sum()
    ps[i] = 5 ** i
}

log('---')

let digits = '=-012'

function fromS(s) {
    let x = 0
    for (let i = 0; i < s.length; ++i) {
        x = x * 5 + digits.indexOf(s[i]) - 2
    }
    return x
}

assert(fromS('1-0---0') === 12345)

function toS(x) {
    let out = ''
    let i = pMaxs.findIndex(p => p >= abs(x))
    while (i >= 0) {
        let minv = Infinity
        let jmin = Infinity
        for (let j=-2; j<=2; ++j) {
            let v = abs(x - j * ps[i])
            if (v < minv) {
                minv = v
                jmin = j
            }
        }
        out += digits[jmin+2]
        x -= jmin * ps[i]
        i--
    }

    return out
}

assert(toS(12345) === '1-0---0')

let nums = data.split('\n').map(x => fromS(x))
log(toS(nums.sum()))
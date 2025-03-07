const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')

// https://adventofcode.com/2021/day/21
process.chdir('/Users/nmiles/source/aoc/2021/day21')

// let data = fs.readFileSync('data.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let pos = [6, 2]

// pos = [3, 7]
let score = [0, 0]
let rolls = 0
let rollPos = 0

function roll() {
    let value = rollPos + 1
    rollPos = (rollPos + 1) % 10
    ++rolls
    return value
}

function go(player) {
    let value = roll() + roll() + roll()
    pos[player] = (pos[player] + value) % 10
    score[player] += pos[player] + 1
}

while (true) {
    go(0)
    if (score.max() >= 1000) break
    go(1)
    if (score.max() >= 1000) break
}

// should be (score) 745 * (rolls) 993 = 739785
log(score.min(), rolls, score.min() * rolls)
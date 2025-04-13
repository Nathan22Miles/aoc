const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2020/day/25
process.chdir('/Users/nmiles/source/aoc/2020/day25')

let doorPublicKey = 2069194
let cardPublicKey = 16426071


// Set the value to itself multiplied by the subject number.
// Set the value to the remainder after dividing the value by 20201227
function transform(subject, loopSize) {
    let value = 1
    for (let i = 0; i < loopSize; i++) {
        value = (value * subject) % 20201227
    }
    return value
}

function findLoopSize(publicKey) {
    let value = 1
    let loopSize = 0
    while (value !== publicKey) {
        value = (value * 7) % 20201227
        loopSize++
    }
    return loopSize
}

let doorLoopSize = findLoopSize(doorPublicKey)
let cardLoopSize = findLoopSize(cardPublicKey)

let private1 = transform(doorPublicKey, cardLoopSize)
let private2 = transform(cardPublicKey, doorLoopSize)

assert.strictEqual(private1, private2)

log(private1)

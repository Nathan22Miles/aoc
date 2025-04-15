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

// data = '03081770884921959731165446850517'

let skip = parseInt(data.slice(0, 7))

let signal = data.split('').map(Number)

signal = [...Array(10000)].flatMap(() => signal)

class ArraySum {
    constructor(array) {
        this.prefixSums = this.buildPrefixSums(array)
    }

    /**
     * Builds the prefix sum array.
     * @param {number[]} array - The input array.
     * @returns {number[]} - The prefix sum array.
     */
    buildPrefixSums(array) {
        let prefixSums = [0]
        for (let i = 0; i < array.length; i++) {
            prefixSums.push(prefixSums[i] + array[i])
        }
        return prefixSums
    }

    /**
     * Calculates the sum of a slice of the array.
     * @param {number} start - The start index (inclusive).
     * @param {number} end - The end index (exclusive).
     * @returns {number} - The sum of the slice.
     */
    sumSlice(start, end) {
        const len = this.prefixSums.length
        if (start >= len) return 0

        end = Math.min(end, len - 1)
        return this.prefixSums[end] - this.prefixSums[start]
    }
}

function phase(s) {
    let arr = new ArraySum(s)
    let len = s.length
    let out = []

    for (let i=0; i < len; i++) {
        let sum = 0
        let span = i + 1

        let j = i
        while (j < len) {
            sum += arr.sumSlice(j, j + span)
            sum -= arr.sumSlice(j + 2*span, j + 3*span)
            j += span * 4
        }

        out.push(Math.abs(sum) % 10)
    }
    return out
}

for (let i=0; i < 100; i++) {
    log('iteration', i)
    signal = phase(signal)
}

log(signal.slice(skip, skip + 8).join('')) // 84462026

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, sfy, ssfy, pad, parse2D } = require('../../utils')

// https://adventofcode.com/2023/day/15

process.chdir('/Users/nmiles/source/aoc/2023/day15')

let myData = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')

/*
Determine the ASCII code for the current character of the string.
Increase the current value by the ASCII code you just determined.
Set the current value to itself multiplied by 17.
Set the current value to the remainder of dividing itself by 256.
 */

function hash(str) {
    let current = 0
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i)
        current += code
        current *= 17
        current %= 256
    }
    return current
}

assert(hash('HASH') === 52)

log('done')

assert(testData.split(',').map(hash).sum() === 1320)

log(myData.split(',').map(hash).sum())

log(hash('rn'))

// testData 1320
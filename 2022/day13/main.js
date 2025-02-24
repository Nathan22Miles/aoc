
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn } = require('../../utils')

// https://adventofcode.com/2022/day/13

process.chdir('/Users/nmiles/source/aoc/2022/day13')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let ps = data.split('\n\n')
            .map(parts => parts.split('\n'))
            .map(pieces => { 
                let [left, right] = pieces
                return [JSON.parse(left), JSON.parse(right)]
            })

function num(n) { return !Array.isArray(n) }
function list(n) { return Array.isArray(n) }

function compare(left, right) {
    if (num(left) && num(right)) return Math.min(1, Math.max(-1, left - right))
    if (num(left)) return compare([left], right)
    if (num(right)) return compare(left, [right])
    
    if (left.length === 0 && right.length === 0) { return 0 }

    if (left.length === 0) return -1
    if (right.length === 0) return 1

    let result = compare(left[0], right[0])
    if (result === 0) return compare(left.slice(1), right.slice(1))
    return result
}

let result = ps.flatMap(
    (pair, i) => { 
        let [left, right] = pair
        let result = compare(left, right) === -1 ? [i+1] : []
        return result
    }).sum()

log(result) // 6395
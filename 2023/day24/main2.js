
const assert = require('assert')
const fs = require('fs')
const log = console.log
const nerdamer = require('nerdamer/all')

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn } = require('../../utils')

// https://adventofcode.com/2023/day/24

// try solving at https://live.sympy.org/

process.chdir('/Users/nmiles/source/aoc/2023/day24')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let stones = data.split('\n').map(line => line.match(/(-?\d+)/g).map(parseIntFn))

function solve() {
    let eqs = []
    let _stones = stones.slice(0, 3)
    // _stones.push(stones[5])

    for (let stone of _stones) {
        let [x, y, z, vx, vy, vz] = stone
        eqs.push(`(${x}-x)*(${vy}-b)-(${vx}-a)*(${y}-y)=0`)
        eqs.push(`(${y}-y)*(${vz}-c)-(${vy}-b)*(${z}-z)=0`)
    }
    
    log(eqs.join('\n'))
}

solve()


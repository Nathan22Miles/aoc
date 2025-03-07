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

let throws = [
    1+1+1,1+1+2,1+1+3,
    1+2+1,1+2+2,1+2+3,
    1+3+1,1+3+2,1+3+3,
    2+1+1,2+1+2,2+1+3,
    2+2+1,2+2+2,2+2+3,
    2+3+1,2+3+2,2+3+3,
    3+1+1,3+1+2,3+1+3,
    3+2+1,3+2+2,3+2+3,
    3+3+1,3+3+2,3+3+3
]

let startPos = [6, 2]
// startPos = [3, 7]  // test data

let rolls = 0

function _wins(player, pos, score) {   // player 0 or 1
    if (score[0] >= 21) return [1, 0]
    if (score[1] >= 21) return [0, 1]

    let winCounts = [0, 0]

    for (let thr of throws) {
        let _pos = pos.slice()
        let _score = score.slice()

        _pos[player] = (_pos[player] + thr) % 10
        _score[player] += _pos[player] + 1
        
        let tmp = wins(1 - player, _pos, _score)
        winCounts = winCounts.add(tmp)
    }

    return winCounts
}

let wins = memoize(_wins)

// should be 4,443,560,927,763,155 = 4*10^15
log(wins(0, startPos, [0,0]).max())
// log('rolls', rolls)
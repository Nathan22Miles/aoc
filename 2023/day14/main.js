
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue, 
            rng, sfy, ssfy, pad, parse2D } = require('../../utils')

// https://adventofcode.com/2023/day/14

process.chdir('/Users/nmiles/source/aoc/2023/day14')

let myData = fs.readFileSync('data.txt', 'utf8')

let testData = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`

function rollLeft(row) {
    let to = 0
    for (let j = 0; j < row.length; j++) {
        switch (row[j]) {
            case '.': 
                break
            case '#': to = j+1
                break
            case 'O': 
                if (to !== j) {
                    row[to] = 'O'
                    row[j] = '.'
                }
                to = to + 1
                break
            default:
                assert(false, `Invalid character ${row[j]}`)
        }
    }

    return row
}




// assert(rollLeft('.0#.0.#0.0'.split('')).eq('0.#0..#00.'.split('')))

function calcLoad(row) {
    let len = row.length
    return row.map((cc, i) => cc === 'O' ? len-i : 0).sum()
}

// assert(calcLoad('00#.....#0'.split('')) === 20)

function run(data, expected) {
    let load = parse2D(data)
        .transpose()
        .map(rollLeft)
        .map(calcLoad)
        .sum()
    assert(load === expected, `Expected ${expected} but got ${load}`)
}

// run(testData, 136)

run(myData, 109939)

log('done')

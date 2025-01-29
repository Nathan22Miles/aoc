
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn } = require('../../utils')

// https://adventofcode.com/2022/day/14

process.chdir('/Users/nmiles/source/aoc/2022/day14')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let offset = 490

function parseLine(line) {
    let parts = line.split(' -> ')
    let pairs = parts.slice(0, -1).zip(parts.slice(1))
    return pairs.map(([a, b]) => [
        ... a.split(',').map(parseIntFn), 
        ... b.split(',').map(parseIntFn)
    ]).map(([a,b,c,d]) => [a-offset,b,c-offset,d])
}

let lines = data.split('\n').flatMap(parseLine)
let xMin = lines.flatMap(([x, y, x2, y2]) => [x, x2]).min()
let xMax = lines.flatMap(([x, y, x2, y2]) => [x, x2]).max()
let yMax = lines.flatMap(([x, y, x2, y2]) => [y, y2]).max()
log(sfy({xMax, yMax}))

// create an array of zeros with dimensions xMax, yMax
let grid = make2D(xMax + 2, yMax + 1, '.')

for (let [x, y, x2, y2] of lines) {
    if (x2 < x) { [x, x2] = [x2, x] }
    if (y2 < y) { [y, y2] = [y2, y] }
    for (let i = x; i <= x2; i++) {
        for (let j = y; j <= y2; j++) {
            grid[i][j] = '#'
        }
    }
}

fs.writeFileSync('log.txt', grid.joinjoin())


// return true if sand drops into abyss
function drop() {
    let [x, y] = [500-offset, 0]
    while (true) {
        if (y >= yMax+1) { 
            return true 
        }

        if (grid[x][y+1] === '.') {
            ++y
            continue
        }
        if (grid[x - 1][y + 1] === '.') {
            ++y
            --x
            continue
        }
        if (grid[x + 1][y + 1] === '.') {
            ++y
            ++x
            continue
        }

        grid[x][y] = 'o'
        return false
    }
}

let count = 1
for (; ; ++count) {
    let done = drop()
    fs.writeFileSync('log.txt', grid.joinjoin())

    if (done) { break }
}

// 586 too low
log(count-1)

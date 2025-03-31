const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2020/day/20
process.chdir('/Users/nmiles/source/aoc/2020/day20')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

function partToLines(x) {
    let [id, ...lines] = x.split('\n')
    id = parseInt(id.match(/Tile (\d+):/)[1])
    lines = lines.map(x => x.split(''))
    return { id, lines }
}

function linesToSides({ id, lines }) {
    let top = lines[0].join('')
    let bottom = lines[lines.length - 1].join('')
    let left = lines.map(x => x[0]).join('')
    let right = lines.map(x => x[x.length - 1]).join('')
    return { id, top, bottom, left, right }
}

function sideToInt(side) {
    let pow = 1
    let val = 0
    for (let i=0; i<side.length; i++) {
        if (side[i] === '#') {
            val += pow
        }
        pow *= 2
    }
    return val
}

let swaps = [
    [1, 2, 3, 4],
    [-2, -1, -4, -3], //rotate 180
    [-1, -2, 4, 3], // flip
    [2, 1, -3, -4], // flip & rotate 180
    [-3, -4, 2, 1], // rotate 90
    [4, 3, -1, -2],
    [3, 4, 1, 2],
    [-4, -3, -2, -1]
]

const top = 0
const bottom = 1
const left = 2
const right = 3

function sidesToSwaps({ id, top, bottom, left, right }) {
    let sides = [top, bottom, left, right].map(sideToInt)
    let sidesR = [top, bottom, left, right].map(s=>s.split('').reverse().join('')).map(sideToInt)
    
    function sw(x) { return x > 0 ? sides[x - 1] : sidesR[-x - 1] }

    return swaps.map(([a, b, c, d], i) => {
        return { id: 10*id+i, sides: [sw(a), sw(b), sw(c), sw(d)] }
    })
}

let squares = data.split('\n\n').map(partToLines).map(linesToSides).flatMap(sidesToSwaps)
log(squares[0], squares.length)

let ups = new Map() // id => ids of square that could be up
let rights = new Map() // id => ids of square that could be to the right
let downs = new Map() // id => ids of square that could be to the down

for (let {id, sides} of squares) {
    for (let {id: id2, sides: sides2} of squares) {
        if (Math.floor(id / 10) === Math.floor(id2 / 10)) continue
        if (sides[right] === sides2[left]) { 
            rights.addToSet(id, id2) 
            assert(rights.get(id).size <= 1)
        }

        if (sides[bottom] === sides2[top]) { 
            downs.addToSet(id, id2) 
            assert(downs.get(id).size <= 1)
        }
    }
}

function goDown(id) {
    if (!downs.has(id)) return ''
    return [...downs.get(id)][0]
}

function goRight(id) {
    if (!rights.has(id)) return ''
    return [...rights.get(id)][0]
}

function downCount(id) {
    let count = 0
    while (true) {
        id = goDown(id)
        if (!id) break
        count++
    }
    return count
}

function rightCount(id) {
    let count = 0
    while (true) {
        id = goRight(id)
        if (!id) break
        count++
    }
    return count
}

let n = 12

let topLefts = squares.map(sq => sq.id).filter(id => downCount(id) === 11 && rightCount(id) === 11)

function placeSquares(sq) {
    let rows = []
    let row = []
    for (let i = 0; i < n; i++) {
        if (!sq) {
            return null
        }

        row.push(sq)
        sq = goRight(sq)
    }
    rows.push(row)

    for (let i = 0; i < n - 1; i++) {
        let row = []
        sq = goDown(rows[i][0])
        for (let j = 0; j < n; j++) {
            if (!sq) {
                return null
            }
            // if (goDown(rows[i][j]) !== sq) {
            //     return null
            // }

            row.push(sq)
            sq = goRight(sq)
        }
        rows.push(row)
    }

    return rows
}

function cornerScore(corners) {
    let score = 1
    for (let id of corners) {
        score *= Math.floor(id / 10)
    }
    return score
}

for (let sq of topLefts) {
    let rows = placeSquares(sq)
    if (!rows) continue

    let corners = [rows[0][0], rows[0][n - 1], rows[n - 1][0], rows[n - 1][n - 1]]
    log('corners', cornerScore(corners))
}
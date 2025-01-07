
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn } = require('../../utils')

// https://adventofcode.com/2023/day/18

process.chdir('/Users/nmiles/source/aoc/2023/day18')

let myData = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// let data = testData
let data = myData

let plan = data.split('\n').map(r => r.split(' '))
let path = [[0,0]]

for (let step of plan) {
    let [dir, dist] = step
    dist = Number(dist)

    let table = {
        'U': [0, -1],
        'D': [0, 1],
        'L': [-1, 0],
        'R': [1, 0],
    }

    let [x, y] = path.last()
    let [dx, dy] = table[dir]

    for (let i = 0; i < dist; i++) {
        x += dx
        y += dy
        path.push([x, y])
    }
}

assert(path.last().eq([0,0]))
path = path.slice(0, -1)

let xMax = path.map(p => p[0]).max()
let xMin = path.map(p => p[0]).min()
let yMax = path.map(p => p[1]).max()
let yMin = path.map(p => p[1]).min()

let xSize = xMax - xMin + 1
let ySize = yMax - yMin + 1

let grid = make2D(ySize, xSize, '.')
for (let [x, y] of path) {
    grid[y-yMin][x-xMin] = '#'
}

let rows = grid.map(r => r.join(''))
fs.writeFileSync('grid.txt', rows.join('\n'))

let D = [1, 0]
let U = [-1, 0]
let R = [0, 1]
let L = [0, -1]

let corners = [
    ['F', D, R],
    ['L', U, R],
    ['7', D, L],
    ['J', U, L],
]

function isPath(y, x, [dy, dx]) {
    let row = grid[y+dy]
    if (!row) return false
    let cell = row[x+dx]
    if (!cell) return false
    if (cell === '.') return false
    return true
}

function makeCorner(y, x) {
    for (let corner of corners) {
        let [_corner, d1, d2] = corner
        if (isPath(y, x, [0,0]) && isPath(y, x, d1) && isPath(y, x, d2)) {
            grid[y][x] = _corner
            return
        }
    }
}

for (let y=0; y < ySize; y++) {
    for (let x=0; x < xSize; x++) {
        makeCorner(y, x)
    }
}

fs.writeFileSync('grid2.txt', grid.map(r => r.join('')).join('\n'))

function interiors(row) {
    row = row.join('')
    row = row.replace(/F#*7/g, '')
    row = row.replace(/L#*J/g, '')
    row = row.replace(/F#*J/g, '#')
    row = row.replace(/L#*7/g, '#')
    let parts = row.split('#').odds()
    return parts.map(lengthFn).sum()
}

function paths(row) {
    row = row.join('').replace(/\./g, '')
    return row.length
}

let volume = grid.map(row => interiors(row)+ paths(row)).log().sum()
log(volume)

// log(rows.map(volume).log().sum())

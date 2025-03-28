const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2020/day/17
process.chdir('/Users/nmiles/source/aoc/2020/day17')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

data = data.split('\n').map(line => line.split(''))

// active
//    [2,3] active neighbors => active, else inactive
// inactive 
//    [3] of active neighbors => active, else inactive

// inactive neighbors of active cells with 3 active neighbors OR
// active cells with 2 or 3 active neighbors

let cellMap = new JMap()

function getCell([x,y,z,z2]) {
    let cell = cellMap.get([x,y,z,z2])
    if (!cell) {
        cell = [x,y,z,z2]
        cellMap.set(cell, cell)
    }
    return cell
}

function neighbors([x,y,z,z2]) {
    let cells = []
    for (let dx of [-1, 0, 1]) {
        for (let dy of [-1, 0, 1]) {
            for (let dz of [-1, 0, 1]) {
                for (let dz2 of [-1, 0, 1]) {
                    if (dx === 0 && dy === 0 && dz === 0 && dz2 === 0) continue
                    cells.push(getCell([x+dx, y+dy, z+dz, z2+dz2]))
                }
            }
        }
    }
    return cells
}

let neighborsMap = new Map()

function getNeighbors(cell) {
    let cells = neighborsMap.get(cell)
    if (!cells) {
        cells = neighbors(cell)
        neighborsMap.set(cell, cells)
    }
    return cells
}


function activeCell(cell) { return active.has(cell) }

function inactiveCell(cell) { return !active.has(cell) }

function neighborCount(cell) { return getNeighbors(cell).filter(activeCell).length }


// inactive neighbors of active cells with 3 active neighbors OR
// active cells with 2 or 3 active neighbors

function cycle() {
    let inactive = new Set()
    let _active = new Set()

    for (let cell of active) {
        let ns = getNeighbors(cell)
        inactive._add(ns.filter(inactiveCell))
        let count = ns.filter(activeCell).length
        if (count === 2 || count === 3) {
            _active.add(cell)
        }
    }

    for (let cell of inactive) {
        if (neighborCount(cell) === 3) {
            _active.add(cell)
        }
    }

    return _active
}

let active = new Set()

data.forEach((row, y) => {
    row.forEach((cell, x) => {
        if (cell === '#') {
            active.add(getCell([x,y,0,0]))
        }
    })
})

for (let i=0; i<6; ++i) {
    active = cycle()
}

// testData = 848
log(active.size)




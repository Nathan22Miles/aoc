
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

function rollRowLeft(row) {
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

function rollLeft(m, reversed) {
    let r = m.length
    for (let i = 0; i < r; i++) {
        let row = rng(r).map(j => m[i][j])
        if (reversed) row.reverse()
        rollRowLeft(row)
        if (reversed) row.reverse()
        rng(r).forEach(j => m[i][j] = row[j])
    }

    return m
}

function rollDown(m, reversed) {
    let c = m[0].length
    // log(m.toString())

    for (let i = 0; i < c; i++) {
        let col = rng(c).map(j => m[j][i])
        if (!reversed) col.reverse()
        rollRowLeft(col)
        if (!reversed) col.reverse()
        rng(c).forEach(j => m[j][i] = col[j])
    }

    return m
}

function assertEq(a, b) {
    if (a !== b) {
        log(`Expected: `)
        log(b)
        log(`Got: `)
        log(a)
        debugger
    }
}

// assertEq(rollLeft(parse2D('.O\n..'), false).toString(), parse2D('O.\n..').toString())
// assertEq(rollLeft(parse2D('O.\n..'), true ).toString(), parse2D('.O\n..').toString())
// assertEq(rollDown(parse2D('.O\n..'), false).toString(), parse2D('..\n.O').toString())
// assertEq(rollDown(parse2D('..\n.O'), true ).toString(), parse2D('.O\n..').toString())

function cycle(m) {
    rollDown(m, true)
    rollLeft(m, false)
    rollDown(m, false)
    rollLeft(m, true)
}

// assert(rollLeft('.0#.0.#0.0'.split('')).eq('0.#0..#00.'.split('')))

function calcLoad(m) {
    let r = m.length
    let c = m[0].length

    let load = 0
    for (let iRow = 0; iRow < r; iRow++) {
        for (let j = 0; j < c; j++) {
            if (m[iRow][j] === 'O') {
                load += r - iRow
            }
        }
    }

    return load
}

function isCycle(loads, start, end) {
    let len = end - start
    
    if (start+3*len > loads.length) return false

    while (end+len < loads.length) {
        let a = loads.slice(start, end)
        let b = loads.slice(end, end + len)
        if (!a.eq(b)) {
            // log('a', sfy(a.slice(0,5)))
            // log('b', sfy(b.slice(0,5)))
            return false
        }
        start += len
        end += len
    }

    return true
}

// assert(isCycle([1, 2, 3, 4, 1, 2, 3, 4], 0, 4))
// assert(!isCycle([1, 2, 3, 4, 1, 2, 3, 4], 1, 5))

function findCycle(loads) {
    let map = new Map()
    
    loads.forEach((ld, i) => map.push(ld, i))
    
    for (let i = 0; i < loads.length; i++) {
        let ld = loads[i]
        let ends = map.get(ld).filter(j => j > i)

        for (let end of ends) {
            if (isCycle(loads, i, end)) {
                return [i, end]
            }
        }
    }

    return []
}

// assert(findCycles([0, 0, 1, 2, 3, 4, 1, 2, 3, 4]).eq([[2, 6]]))
// assert(findCycles([0, 0, 1, 2, 3, 4, 1, 2, 3, 5]).eq([]))

function run(data, expected) {
    let m = parse2D(data)
    let loads = []

    for (let i = 0; i < 500; i++) {  
        cycle(m)
        let load = calcLoad(m)
        loads.push(load)
    }

    let [start, end] = findCycle(loads)
    let len = end - start
    log('cycle', start, end, len)

    // verify cycle
    for (let i = 0; i < len; i++) {
        assertEq(loads[start + i], loads[start + i + len])
    }

    // log(sfy(loads.slice(0, 20)))

    function calc(i) {
        let j = i - start
        let k = j % len
        return loads[start + k]
    }

    // verify load preadiction calculation
    assert(loads[401] === calc(401))

    log(calc(1000000000 - 1))
}

// run(testData)
run(myData)

log('done')

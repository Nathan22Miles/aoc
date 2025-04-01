const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// Need to write generate flipV, flipH, transpose functions

// https://adventofcode.com/2020/day/23
process.chdir('/Users/nmiles/source/aoc/2020/day23')

// placing them on the bottom of their own deck so that the winner's card is above the other card.

// let data = fs.readFileSync('data.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
let data = '952438716'
data = data.split('').map(parseIntFn)

// pick three cups that are immediately clockwise of the current cup
// They are removed from the circle
// destination cup: the cup with a label equal to the current cup's label minus one. 
//     If this would select one of the cups that was just picked up, the crab will keep subtracting one until it finds a cup that wasn't just picked up.
//     If at any point in this process the value goes below the lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
// place the cups just picked up immediately clockwise of the destination cup
// current cup: the cup which is immediately clockwise of the current cup.

function front(cups, current) {
    let i = cups.indexOf(current)
    if (i == 0) return cups
    return cups.slice(i).concat(cups.slice(0, i))
}

function wrap(i) {
    if (i < 0) return 8
    if (i > 8) return 0
    return i
}

function move(cups, mv) {
    let current = cups[0]
    let pick = cups.slice(1, 4)
    let dest = current - 1
    while (pick.includes(dest) || dest < 1) {
        if (dest < 1) dest = 9
        else dest--
    }
    // log('-- move --', mv)
    // log('cups', sfy(cups))
    // log('pick up', sfy(pick))
    // log('dest', dest)

    cups.splice(1, 3);
    let i = cups.indexOf(dest)
    assert(i > -1)
    let cups2 = cups.slice(0, i+1).concat(pick).concat(cups.slice(i+1))
    let j = cups2.indexOf(current)
    assert(j > -1)
    return front(cups2, cups2[wrap(j+1)])
}

for (let i=0; i < 100; i++) {
    data = move(data, i+1)
    // log(data)
}

log(front(data, 1).slice(1).join(''))


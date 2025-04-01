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
// data = '389125467' // testData
data = data.split('').map(parseIntFn)

let _count = 100
let _length = 9

_count = 10000000
_length = 1000000

// pick three cups that are immediately clockwise of the current cup
// They are removed from the circle
// destination cup: the cup with a label equal to the current cup's label minus one. 
//     If this would select one of the cups that was just picked up, the crab will keep subtracting one until it finds a cup that wasn't just picked up.
//     If at any point in this process the value goes below the lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
// place the cups just picked up immediately clockwise of the destination cup
// current cup: the cup which is immediately clockwise of the current cup.

let i2cups = new Map() // i = 1.._length => { cup, next, prev }
let cups = []
for (let i=0; i<_length; ++i) {
    let cup = i < data.length ? data[i] : i+1
    const _cup = { cup }
    cups.push(_cup)
    i2cups.set(cup, _cup)
}
cups.push(cups[0])

for (let i = 0; i < _length; ++i) {
    let cup1 = cups[i]
    let cup2 = cups[i+1]
    cup1.next = cup2
    cup2.prev = cup1
}

function removeNext3(current) {
    let cup = i2cups.get(current)
    let cup1 = cup.next
    let cup2 = cup1.next
    let cup3 = cup2.next
    cup.next = cup3.next
    cup3.next.prev = cup
    return [cup1, cup2, cup3]
}

function insertAfter(dest, [cup1, cup2, cup3]) {
    let cup = i2cups.get(dest)
    let cup4 = cup.next
    
    cup.next = cup1
    cup1.prev = cup

    cup4.prev = cup3
    cup3.next = cup4
}

// data = '389125467' // testData
function move(current) {
    // logCups(current)
    let pick = removeNext3(current)

    let dest = current - 1
    while (pick.map(d=>d.cup).includes(dest) || dest < 1) {
        if (dest < 1) dest = _length
        else dest--
    }
    // log('dest', dest)
    // log('pick', pick.map(d=>d.cup))

    insertAfter(dest, pick)
    return i2cups.get(current).next.cup
}

function checkLength(current) {
    let cup = i2cups.get(current).next
    let count = 1
    while (cup.cup != current) {
        count++
        cup = cup.next
    }
    assert(count == _length)
}

function logCups(current) {
    let cups = []
    let cup1 = i2cups.get(current)
    for (let i = 0; i < 9; ++i) {
        cups.push(cup1.cup)
        cup1 = cup1.next
    }
    log(sfy(cups))
}

let current = data[0]
for (let i=0; i < _count; i++) {
    current = move(current)
}

let cup1 = i2cups.get(1)
log(cup1.next.cup * cup1.next.next.cup)


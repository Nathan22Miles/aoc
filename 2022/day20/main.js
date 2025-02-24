// adapted from https://topaz.github.io

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, runBFS } = require('../../utils')

// https://adventofcode.com/2022/day/20
process.chdir('/Users/nmiles/source/aoc/2022/day20')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let ns = data.split('\n').map(parseIntFn)
let nsz = ns.length

class Node {
    constructor(n, prev, next) {
        this.n = n
        this.prev = prev
        this.next = next
    }
}

let nodes = ns.map((n, i) => new Node(n, null, null, i))
for (let i = 0; i < nsz; ++i) {
    nodes[i].prev = nodes[modulo(i - 1, nsz)]
    nodes[i].next = nodes[modulo(i + 1, nsz)]
}

assert(nodes[0].prev === nodes[nsz - 1])
assert(nodes[nsz - 1].next === nodes[0])

function verify(_p, len) {
    let __p = forward(_p, len)
    assert(__p === _p)
    __p = backward(_p, len)
    assert(__p === _p)
}

verify(nodes[0], nsz)

function forward(_p, n) {
    while (n > 0) {
        _p = _p.next
        n--
    }
    return _p
}

function backward(_p, n) {
    while (n > 0) {
        _p = _p.prev
        n--
    }
    return _p
}

for (let i=0; i<nsz; ++i) {
    p = nodes[i]

    let n = p.n
    if (n === 0) continue

    // remove p
    let pnext = p.next
    let pprev = p.prev
    pprev.next = p.next
    pnext.prev = p.prev

    let q = n > 0 ? forward(p, n + 1) : backward(p, -n)

    // insert p before q
    let qprev = q.prev
    qprev.next = p
    p.prev = qprev
    p.next = q
    q.prev = p
}

verify(nodes[0], nsz)

let p0 = nodes[0]
while (p0.n !== 0) {
    p0 = p0.next
}

log(forward(p0,1000).n + forward(p0,2000).n + forward(p0,3000).n)

// let _p = nodes[0]
// for (let i=0; i<nsz; ++i) {
//     log(_p.n)
//     _p = _p.next
// }

// 14813 too low
// 11093 too low
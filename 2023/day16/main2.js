
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, sfy, ssfy, pad, parse2D } = require('../../utils')


// https://adventofcode.com/2023/day/16

process.chdir('/Users/nmiles/source/aoc/2023/day16')

let myData = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
let data = myData

let _m = new Maze(data, { addBorder: true, borderChar: '#' })

let { m, r, c, fr } = _m
let { U, D, L, R, ds, iU, iD, iL, iR } = _m.dirs()
let dirNames = ['U', 'D', 'L', 'R']

let next = {
    '.': [[U], [D], [L], [R]],
    '-': [[L,R], [L,R], [L], [R]],
    '|': [[U], [D], [U,D], [U,D]],
    '/': [[R], [L], [D], [U]],
    '\\': [[L], [R], [U], [D]],
}

function eval([_p,_d]) {
    let visits = rng(m.length).map(p => new Set())

    function follow(p, d) {
        let mp = m[p]
        if (mp === '#') return
        if (visits[p].has(d)) return

        visits[p].add(d)

        const row = next[mp]
        const i = _m.d2i(d)
        let [d1, d2] = row[i]

        follow(p + d1, d1)
        if (d2) follow(p + d2, d2)
    }

    follow(_p, _d)

    return visits.filter(v => v.size > 0).length
}

let tops = rng(1, c - 1).map(col => [col + c, D])
let bottoms = rng(1, c - 1).map(col => [col + c*(r-2), U])
let lefts = rng(1, r - 1).map(row => [c * row + 1, R])
let rights = rng(1, r - 1).map(row => [c * row + c - 2, R])

let count = [...tops, ...bottoms, ...lefts, ...rights].map(eval).max()
log(count)


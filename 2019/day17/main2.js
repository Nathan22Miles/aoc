const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2019/day/17
process.chdir('/Users/nmiles/source/aoc/2019/day17')

let data = fs.readFileSync('try1.txt', 'utf8')

let path = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJK'.split('')

let map = new Map()
let m = data.split('\n').map(line => line.split(''))
m.forEach((line, r) => {
    line.forEach((cc, c) => {
        map.set(cc, [r,c])
    })
})

function lm(x) { return Math.max(Math.min(x, 1), -1) }

let cmds = []
let dirs = [[-1,0], [0,1], [1,0], [0,-1]]
let dir = 0
let rc = map.get('0')
for (let next of path) {
    let [r,c] = rc
    let [nr, nc] = map.get(next)
    let dr = nr - r
    let dc = nc - c
    assert(dr === 0 || dc === 0)
    let nextDir = dirs.findIndex(([_dr,_dc]) => lm(dr) === _dr && lm(dc) === _dc)

    cmds.push((dir+1)%4 === nextDir ? 'R' : 'L')
    let dist = Math.abs(dr) + Math.abs(dc)
    cmds.push(dist.toString())

    dir = nextDir
    rc = [nr, nc]
}

let _pgm = cmds.join(',') + ','

function encode(pgm, main, pats) {
    if (main.length > 21) { return }

    if (pgm.length === 0) {
        main = main.slice(0, -1)
        pats = pats.map(pat => pat.slice(0, -1))

        fs.writeFileSync('pgm.txt', main + '\n' + pats.join('\n') + '\nn\n')
        log('solution in pgm.txt')
        process.exit()
    }

    pats.forEach((pat, i) => {
        if (pgm.startsWith(pat)) {
            encode(pgm.slice(pat.length),
                main + String.fromCharCode(65 + i) + ',',
                pats)
        }
    })

    if (pats.length > 2) { return }
    for (let i = 1; i <= 21; i++) {
        let pat = pgm.slice(0, i)
        if (!pat.endsWith(',')) { continue }

        encode(pgm.slice(pat.length),
            main + String.fromCharCode(65 + pats.length) + ',',
            [...pats, pat])
    }
}

encode(_pgm, '', [])

log('failed to find a solution')


/*
wake up: [0] from 1 to 2. 
Supply commands as inputs. comma separated. NL at end of line. Max line length 20 (not counting NL)

main movement routine. A, B, or C. e.g.: A,B,B,C<newline>
movement function A: 10,L,8,R,6<newline>
B
C
[yn]<newline> continuous video feed?
 */
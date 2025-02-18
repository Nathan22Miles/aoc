// Adapted from: github.com/juanplopes/advent-of-code-2022/blob/main/day16.py

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn } = require('../../utils')

// https://adventofcode.com/2022/day/16

process.chdir('/Users/nmiles/source/aoc/2022/day16')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData


let lines = data.split('\n').map(x => x.split(/[\s=;,]+/))

// valve => [valve, ...] // all valves
let G = lines.toMap(x => x[1], x => x.slice(10))

// F: valve => rate
let nonZeroValves = lines.filter(x => parseInt(x[5]) !== 0) // no-zero rate valves
let F = nonZeroValves.toMap(x => x[1], x => parseInt(x[5]))

// I: valve => bit mask for non-zero rate valves
let I = nonZeroValves.toMap(x => x[1], (x, i) => 1<<i)

// T: valve => valve => 1 (if directly connected) or Infinity (if not directly connected)
let T = [...G.keys()].toMap(
    x => x, 
    x => [...G.keys()].toMap(y => y, y => G.get(x).includes(y) ? 1 : Infinity))

// Floyd–Warshall algorithm: find shortest path between all pairs of vertices
for (let k of T.keys()) {
    for (let i of T.keys()) {
        for (let j of T.keys()) {
            T.get(i).set(j, 
                Math.min(T.get(i).get(j), T.get(i).get(k) + T.get(k).get(j)))
        }
    }
}

function visit(v, minutes, state, flow, answer) {
    // state is a bit mask of open valves
    // answer.get(state) is the max flow that can be created by opening valves in state

    // we might get to the same state with different flow values, so keep the max
    answer.set(state, Math.max(answer.get(state) ?? 0, flow))

    for (let u of F.keys()) {
        if ((I.get(u) & state)) continue
        
        // Minutes remaining after moving to vale u and closing it
        let minutesRemaining = minutes - T.get(v).get(u) - 1
        if (minutesRemaining <= 0) continue

        // Flow generate by opening valve u now
        let uFlow = minutesRemaining * F.get(u)
        
        visit(u, minutesRemaining, state | I.get(u), flow + uFlow, answer)
    }
    
    return answer
}

let visited1 = visit('AA', 30, 0, 0, new Map())
let total1 = [...visited1.values()].max()
log (total1)

let visited2 = visit('AA', 26, 0, 0, new Map())
let total2 = 0

for (let [k1, v1] of visited2) {
    for (let [k2, v2] of visited2) {
        if (!(k1 & k2)) {
            total2 = Math.max(total2, v1 + v2)
        }
    }
}

log(total2)


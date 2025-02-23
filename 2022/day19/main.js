// adapted from https://topaz.github.io

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, runBFS } = require('../../utils')

// https://adventofcode.com/2022/day/19

process.chdir('/Users/nmiles/source/aoc/2022/day19')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

function toBlueprint(line) {
    let ps = line.split(/(\d+)/).odds().map(parseIntFn)
    return [
        [[0, 0, 0, ps[1]], [0, 0, 0, 1]],  // [cost, production]
        [[0, 0, 0, ps[2]], [0, 0, 1, 0]],
        [[0, 0, ps[4], ps[3]], [0, 1, 0, 0]],
        [[0, ps[6], 0, ps[5]], [1, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0]],
    ]
}

let blueprints = data.split('\n').map(toBlueprint)

function key(hm) {
    let _key = [hm[0][0]+hm[1][0], hm[0][1]+hm[1][1], hm[0][2]+hm[1][2], hm[0][3]+hm[1][3], 
                    hm[1][0], hm[1][1], hm[1][2], hm[1][3]]
    return _key.map(x => pad(Math.max(99-x),2,'0')).join('.')
}

function nextElements(element, blueprint) {
    let [have, make] = element
    let _todo = []

    for (let [cost, more] of blueprint) {
        if (cost.every((_cost, i) => _cost <= have[i])) {       // We can afford this robot.
            const _have = have.add(make).sub(cost)
            const _made = make.add(more)
            _todo.push([_have, _made])
        }
    }

    return _todo
}

let part1 = 0
// let part2 = 1

const _breadth = 200 // for my data 200 was big enough
let i = 0

for (let blueprint of blueprints) {
    i += 1

    let initialElement = [[0, 0, 0, 0], [0, 0, 0, 1]]
    let nextElementsFn = (element) => nextElements(element, blueprint)
    let elements = runBFS(initialElement, key, nextElementsFn, _breadth, 24)
    let geodes = elements.map(element => element[0][0]).max()

    log(i, geodes)
    part1 += geodes * i
}

log(part1)

let part2 = 1
for (let blueprint of blueprints.slice(0,3)) {
    let initialElement = [[0, 0, 0, 0], [0, 0, 0, 1]]
    let nextElementsFn = (element) => nextElements(element, blueprint)
    let elements = runBFS(initialElement, key, nextElementsFn, _breadth, 32)
    
    let geodes = elements.map(element => element[0][0]).max()
    part2 = geodes * part2
}

log(part2)
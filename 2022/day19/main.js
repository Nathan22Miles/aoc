// adapted from https://topaz.github.io

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn } = require('../../utils')

// https://adventofcode.com/2022/day/19

process.chdir('/Users/nmiles/source/aoc/2022/day19')

function runBFS(initialElement, keyFn, nextElementsFn, valueFn, breadth, rounds) {
    let todo = new PriorityQueue()
    todo.enqueue(initialElement, key(initialElement))

    for (let round = rounds; round > 0; round--) {
        let _todo = new PriorityQueue()                      // Queue for the next minute.
        let processed = 0
        let previousKey = ''

        while (processed < breadth && !todo.isEmpty()) {
            let { vertex: element, priority: key } = todo.dequeue()
            if (key === previousKey) { continue }
            previousKey = key

            ++processed
            for (let nextElement of nextElementsFn(element)) {
                _todo.enqueue(nextElement, keyFn(nextElement))
            }
        }

        todo = _todo
    }

    let _max = -Infinity
    while (!todo.isEmpty()) {
        let { vertex: _element } = todo.dequeue()
        _max = Math.max(_max, valueFn(_element))
    }

    return _max
}

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

const _breadth = 1000
let i = 0

for (let blueprint of blueprints) {
    i += 1

    let initialElement = [[0, 0, 0, 0], [0, 0, 0, 1]]
    let nextElementsFn = (element) => nextElements(element, blueprint)
    let valueFn = (element) => element[0][0]
    let qty = runBFS(initialElement, key, nextElementsFn, valueFn, _breadth, 24)
    
    log(i, qty)
    part1 += qty * i
    // part2 *= run(blueprint, 32) if i<4 else 1
}

log(part1)
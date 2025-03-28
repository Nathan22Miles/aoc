const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2020/day/16
process.chdir('/Users/nmiles/source/aoc/2020/day16')

let data = fs.readFileSync('data.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let [rules, myTicket, nearby] = data.split('\n\n')

function rangeSet(l, h) {
    let set = new Set()
    for (let i = l; i <= h; i++) {
        set.add(i)
    }
    return set
}

function parseRule(rule) {
    let [field, range] = rule.split(': ')
    let [[l1, h1], [l2, h2]] = range.split(' or ').map(r => r.split('-').map(x => parseInt(x)))
    return { field, range: rangeSet(l1,h1).or(rangeSet(l2,h2)) }
}

let valid = new Set()
for (let rule of rules.split('\n')) {
    let { range } = parseRule(rule)
    valid = valid.or(range)
}

let invalids = []
let tickets = nearby.split('\n').slice(1).map(line => line.split(',').map(x => parseInt(x)))
for (let ticket of tickets) {
    for (let field of ticket) {
        if (!valid.has(field)) {
            invalids.push(field)
        }
    }
}

log(invalids.sum())



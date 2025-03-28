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
let fields = []

for (let rule of rules.split('\n')) {
    let { field, range } = parseRule(rule)
    valid = valid.or(range)
    fields.push({ field, range, possibles: [] })
}

let tickets = nearby.split('\n').slice(1).map(line => line.split(',').map(x => parseInt(x)))

function validTicket(ticket) {
    return ticket.every(field => valid.has(field))
}

tickets = tickets.filter(validTicket)

for (let {field, range, possibles} of fields) {
    for (let i = 0; i < fields.length; i++) {
        if (tickets.every(ticket => range.has(ticket[i]))) {
            possibles.push(i)
        }
    }
}

let foundFields = []

function eliminate() {
    let found = fields.filter(f => f.possibles.length === 1)
    if (found.length === 0) {
        return false
    }

    let val = found[0].possibles[0]
    foundFields.push(found[0])
    log('found', found[0].field, val)
    
    fields = fields.filter(f => f.field !== found[0].field)
    fields.forEach(f => f.possibles = f.possibles.filter(p => p !== val))
    
    return true
}

while (eliminate()) {}

assert(fields.length === 0)

let departures = foundFields.filter(f => f.field.startsWith('departure'))
assert(departures.length === 6)

let mine = tickets.last()

let departureVals = departures.map(f => f.possibles[0]).map(i => mine[i]).log().mul()
log(departureVals)





const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2020/day/19
process.chdir('/Users/nmiles/source/aoc/2020/day19')

let data = fs.readFileSync('data.txt', 'utf8')
// data = testData

function parse(line) {
    const [id, rule] = line.split(': ')
    if (rule.startsWith('"')) {
        return [id, rule[1]]
    }
    const ors = rule.split(' | ')
    const ands = ors.map(or => or.split(' '))
    return [id, ands]
}

let rules = new Map()
let [_rules, msgs] = data.split('\n\n')
_rules.split('\n').forEach(line => {
    const [id, rule] = parse(line)
    rules.set(id, rule)
})

function expand(id) {
    let rule = rules.get(id)
    if (typeof rule === 'string') { return rule }

    let expandAnds = ands => ands.map(id => expand(id)).join('')
    let ors = rule.map(expandAnds).join('|')
    return `(${ors})`
}

let rgx = expand('0')
log(rgx)
let re = new RegExp(`^${rgx}$`)
let count = 0
msgs.split('\n').forEach(msg => {
    if (re.test(msg)) {
        count++
    }
})
log(count)


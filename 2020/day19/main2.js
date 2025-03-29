const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2020/day/19
process.chdir('/Users/nmiles/source/aoc/2020/day19')

let data = fs.readFileSync('data2.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

function parseRule(line) {
    const [id, rule] = line.split(': ')
    if (rule.startsWith('"')) {
        return [id, rule[1]]
    }
    const ors = rule.split(' | ')
    const ands = ors.map(or => or.split(' '))
    return [id, ands]
}

let rw = new Map() // 9_14 -> 42  OR 42 -> 8

let [_rules, msgs] = data.split('\n\n')
_rules.split('\n').forEach(line => {
    const [id, rule] = parseRule(line)
    if (typeof rule === 'string') {
        rw.addToSet(rule[0], id)
    } else {
        for (let alt of rule) {
            if (alt.length === 1) {
                rw.addToSet(alt[0], id)
            } else {
                rw.addToSet(alt[0]+'_'+alt[1], id)
            }
        }
    }
})

msgs = msgs.split('\n')

function join(id, start, end) { return `${id}_${start}_${end}` }

function split(tok) {
    let [id, start, end] = tok.split('_')
    let istart = parseInt(start)
    let iend = parseInt(end)
    return {id, start, end, istart, iend}
}

function addTokens(q, ms, me, msg) {
    for (let i=0; i<msg.length; i++) {
        let c = msg[i]
        let idSet = rw.get(c)
        for (let id of idSet) {
            const tok = join(id, i, i + 1)
            q.push(tok)

            ms.addToSet(i, tok)
            me.addToSet(i + 1, tok)
        }
    }
}

function addSingles(q, ms, me, tok) {
    let { id, start, end, istart, iend } = split(tok)

    let newIds = rw.get(id) ?? new Set()

    for (let newId of newIds) {
        let newTok = join(newId, start, end)

        const add1 = ms.addToSet(istart, newTok)
        const add2 = me.addToSet(iend, newTok)
        if (add1 || add2) {
            q.push(newTok)
        }
    }
}

function addPairs(q, ms, me, tok, tok2) {
    let { id, start, end, istart, iend } = split(tok)
    let { id: id2, start: start2, end: end2, istart: istart2, iend: iend2 } = split(tok2)

    let newIds = rw.get(`${id}_${id2}`) ?? new Set()

    for (let newId of newIds) {
        let newTok = join(newId, start, end2)

        let add1 = ms.addToSet(istart, newTok)
        let add2 = me.addToSet(iend2, newTok)
        if (add1 || add2) {
            q.push(newTok)
        }
    }
}

function parse(msg) {
    // ms = i -> all the matches that start at i
    // me = i -> all the matches that end at i
    // a match is a string of the form id_start_end
    let ms = new Map()
    let me = new Map()
    let q = []
    let goal = join(0, 0, msg.length)

    addTokens(q, ms, me, msg)
    
    while (q.length) {
        let tok = q.pop()

        addSingles(q, ms, me, tok)

        let { istart, iend } = split(tok)
        let toksBefore = me.get(istart) ?? new Set();
        for (let tokBefore of toksBefore) {
            addPairs(q, ms, me, tokBefore, tok)
        }

        let toksAfter = ms.get(iend) ?? new Set();
        for (let tokAfter of toksAfter) {
            addPairs(q, ms, me, tok, tokAfter)
        }
    }

    // [...ms.get(0)].log()
    let matched = ms.get(0).has(goal) ? 1 : 0
    // log(matched, msg)
    return matched
}

log(msgs.map(msg => parse(msg)).sum())




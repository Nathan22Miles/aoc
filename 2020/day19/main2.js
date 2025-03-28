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

function addTokens(ms, me, msg) {
    for (let i=0; i<msg.length; i++) {
        let c = msg[i]
        let idSet = rw.get(c)
        for (let id of idSet) {
            ms.addToSet(i, `${id}_${i}_${i + 1}`)
            me.addToSet(i + 1, `${id}_${i}_${i + 1}`)
        }
    }
}

function addSingles(ms, me, length) {
    let added = 0
    for (i=0; i<length; i++) {
        let toks = ms.get(i) ?? []
        for (let tok of toks) {
            let [id, start, end] = tok.split('_')
            let istart = parseInt(start)
            let iend = parseInt(end)

            let newIds = rw.get(id)
            if (!newIds) continue
            for (let newId of newIds) {
                let newTok = `${newId}_${start}_${end}`

                if (ms.addToSet(istart, newTok)) {
                    added++
                }
                if (me.addToSet(iend, newTok)) {
                    added++
                }
            }
        }
    }
    return added
}

function addPairs(ms, me, length) {
    let added = 0
    for (i = 0; i < length; i++) {
        let toks2 = ms.get(i)
        let toks1 = me.get(i)
        if (!toks1 || !toks2) continue

        for (let tok1 of toks1) {
            let [id1, start1, end1] = tok1.split('_')
            let istart1 = parseInt(start1)
            let iend1 = parseInt(end1)

            for (let tok2 of toks2) {
                let [id2, start2, end2] = tok2.split('_')
                let istart2 = parseInt(start2)
                let iend2 = parseInt(end2)

                let newIds = rw.get(`${id1}_${id2}`)
                if (!newIds) continue

                for (let newId of newIds) {
                    let newTok = `${newId}_${start1}_${end2}`

                    if (ms.addToSet(istart1, newTok)) {
                        added++
                    }
                    if (me.addToSet(iend2, newTok)) {
                        added++
                    }
                }
            }
        }
    }
    return added
}

function parse(msg) {
    // ms = i -> all the matches that start at i
    // me = i -> all the matches that end at i
    // a match is a string of the form id_start_end
    let ms = new Map()
    let me = new Map()
    addTokens(ms, me, msg)
    let goal = `0_0_${msg.length}`
    
    while (true) {
        let added = addSingles(ms, me, msg.length)
        added += addPairs(ms, me, msg.length)
        log(added)
        if (ms.has(goal)) break
        if (added === 0) break
    }

    // [...ms.get(0)].log()
    return ms.get(0).has(goal) ? 1 : 0
}

log(msgs.map(msg => parse(msg)).sum())




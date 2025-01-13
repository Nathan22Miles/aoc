
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd } = require('../../utils')

// https://adventofcode.com/2023/day/20

process.chdir('/Users/nmiles/source/aoc/2023/day20')

let myData = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// let data = testData
let data = myData

let pulseMap = new Map()
let pushes = 0

// data = `broadcaster -> a, b, c
// %a -> b
// %b -> c
// %c -> inv
// &inv -> a`

/*
Flip-flop modules (prefix %) are either on or off; 
they are initially off. 
If a flip-flop module receives a high pulse, it is ignored and nothing happens. 
However, if a flip-flop module receives a low pulse, it flips between on and off. 
If it was off, it turns on and sends a high pulse. 
If it was on, it turns off and sends a low pulse.
 */
class FF {
    constructor(id, outputs) {
        this.id = id
        this.outputs = outputs
        this.label = '%'
        
        this.isOn = false
        this.inputs = []
    }

    initialize() {}

    receive(fromModule, pulseType) {
        if (pulseType === 'high') return

        this.isOn = !this.isOn

        for (let output of this.outputs) {
            q.push([this.id, output, this.isOn ? 'high' : 'low'])
        }
    }
}

/*
    Remember the type of the most recent pulse received from each input.
    They initially remember a low pulse for each input. 
    When a pulse is received, 
        the conjunction module first updates its memory for that input. 
        Then, if it remembers high pulses for all inputs, it sends a low pulse; 
        otherwise, it sends a high pulse.
 */

class Conj {
    constructor(id, outputs) {
        this.prev = new Map()
        this.outputs = outputs
        this.id = id
        this.inputs = []
        this.label = '&'
    }

    initialize() {
        this.inputs.forEach(input => this.prev.set(input, 'low'))
    }

    receive(fromModule, pulse) {
        this.prev.set(fromModule, pulse)
        
        // all high => low pulse
        let outputPulse = [...this.prev.values()].every(v => v === 'high') ? 'low' : 'high'

        let { id } = this
        if (outputPulse === 'high' && ['lk', 'fn', 'fh', 'hh', 'nc'].includes(id)) {
            pulseMap.push(id, pushes)
        }

        for (let output of this.outputs) {
            q.push([this.id, output, outputPulse])
        }
    }
}

let components = new Map() // id -> FF | Conj
let broadcaster = []
let q = [] // [[from, to, signal], ...]

data.split('\n').forEach(line => {
    let parts = line.split(' -> ')
    let outputs = parts[1].split(', ')
    switch (parts[0][0]) {
        case 'b':
            broadcaster = outputs
            break
        case '%':
            id = parts[0].slice(1)
            components.set(id, new FF(id, outputs))
            break
        case '&':
            id = parts[0].slice(1)
            components.set(id, new Conj(id, outputs))
            break
        default:
            assert(false)
            break
    }
})

let ids = [...components.keys()]

for (let id of ids) {
    let component = components.get(id)
    // does not allow for possibility that broadcaster conncts to Conj
    component.inputs = ids.filter(_id => components.get(_id).outputs.includes(id))
    component.initialize()
}

// log(components.get('inv').prev)

let high = 0
let low = 0

function pushButton() {
    ++pushes
    // log(`\n\nPush ${pushes}`)
    q = []
    
    low += 1 // initial button push
    broadcaster.forEach(id => q.push(['broadcaster', id, 'low']))
    
    while (q.length) {
        let [from, to, pulse] = q.shift()
        // log(`${from} -${pulse}-> ${to}`)
        if (pulse === 'high') high++ 
        else low++

        if (!components.has(to)) continue

        components.get(to).receive(from, pulse)
    }
}

function toString(component, visited, indent) {
    let { id, label, inputs } = component
    if (visited.has(id)) return `${indent}${label}${id} -> ...\n`
    visited.add(component.id)

    let str = `${indent}${label}${id}\n`
    for (let input of inputs) {
        str += toString(components.get(input), visited, indent + '  ')
    }

    return str
}

// const text = toString(components.get('nc'), new Set(), '')
// fs.writeFileSync('components.txt', text)

rng(50000).forEach(_ => pushButton())

function logPulse(id) {
    log(sfy(pulseMap.get(id)))
    log(sfy(pulseMap.get(id).deltas()))
    log('\n')
}

let m1 = pulseMap.get('lk').deltas()[0]
let m2 = pulseMap.get('fn').deltas()[0]
let m3 = pulseMap.get('fh').deltas()[0]
let m4 = pulseMap.get('hh').deltas()[0]

log(lcm(lcm(lcm(m1, m2), m3), m4))

// log(low, high, low*high) // 4250, 2750
// 1181722150 too high

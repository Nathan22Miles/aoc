
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, Comp } = require('../../utils')

// https://adventofcode.com/2023/day/20

process.chdir('/Users/nmiles/source/aoc/2023/day20')

let myData = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// let data = testData
let data = myData

// ===============================================

Comp.parse(data, /(?<type>.)(?<id>\w+) -> (?<outputs>.*$)/)
Comp.dump('nc')

Comp.comps('&').forEach(comp => {
    comp.prev = new Map()
    comp.inputs.forEach(input => comp.prev.set(input, 'low'))
})

Comp.setFunction('&', 'receive', function (fromModule, pulse) {
    this.prev.set(fromModule, pulse)

    // all high => send low pulse; else send high pulse
    let outputPulse = [...this.prev.values()].every(v => v === 'high') ? 'low' : 'high'
    for (let output of this.outputs) {
        q.push([this.id, output, outputPulse])
    }
})

Comp.setFunction('%', 'receive', function(fromModule, pulseType) {
    if (pulseType === 'high') return

    this.isOn = !this.isOn
    for (let output of this.outputs) {
        q.push([this.id, output, this.isOn ? 'high' : 'low'])
    }
})

Comp.setFunction('b', 'receive', function() {
    this.outputs.forEach(id => q.push(['broadcaster', id, 'low'])) 
})

let pushes = 0
let high = 0
let low = 0

function pushButton() {
    ++pushes
    q = [['', 'roadcaster', 'low']]
    
    while (q.length) {
        let [from, to, pulse] = q.shift()
        // log(`${from} -${pulse}-> ${to}`)
        if (pulse === 'high') high++ 
        else low++

        let comp = Comp.get(to)
        if (!comp) continue

        comp.receive(from, pulse)
    }
}

rng(1000).forEach(_ => pushButton())
log(low, high, low*high) // 4250, 2750

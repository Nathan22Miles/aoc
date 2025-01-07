
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, sfy, ssfy, pad, parse2D } = require('../../utils')

// https://adventofcode.com/2023/day/15

process.chdir('/Users/nmiles/source/aoc/2023/day15')

let myData = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')

/*
Determine the ASCII code for the current character of the string.
Increase the current value by the ASCII code you just determined.
Set the current value to itself multiplied by 17.
Set the current value to the remainder of dividing itself by 256.
 */

function hash(str) {
    let current = 0
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i)
        current += code
        current *= 17
        current %= 256
    }
    return current
}

assert(hash('HASH') === 52)

class Box {
    // ls = [{label; fl}]
    lenses = []

    constructor(pos) {
        this.pos = pos
    }

    static boxNum(cmd) {
        let parts = cmd.split(/-|=/)
        return hash(parts[0])
    }

    do(cmd) {
        if (cmd.endsWith('-')) {
            this.remove(cmd.slice(0, -1))
            return
        }

        let parts = cmd.split('=')
        this.add(parts[0], parts[1])
    }

    add(label, fl) {
        let lens = this.lenses.find(x => x.label === label)
        if (lens) {
            lens.fl = fl
            return
        }

        this.lenses.push({ label, fl })
    }

    remove(label) {
        this.lenses = this.lenses.filter(x => x.label !== label)
    }

    power() {
        return this.lenses.map((lens, i) => (this.pos + 1)*(i+1)*parseInt(lens.fl)).sum()
    }
}

assert(Box.boxNum('rn-') === 0)

function run(data) {
    let boxes = rng(256).map(x => new Box(x))
    data.split(',').map(cmd => {
        let boxNum = Box.boxNum(cmd)
        let box = boxes[boxNum]
        box.do(cmd)
    })

    return boxes.map(x => x.power()).sum()
}

assert(run(testData), 145)

log('done', run(myData))

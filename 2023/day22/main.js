
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd } = require('../../utils')

// https://adventofcode.com/2023/day/22

process.chdir('/Users/nmiles/source/aoc/2023/day22')

class Brick {
    constructor([x, y, z], [x2, y2, z2]) {
        // this.end1 = { x, y, z }
        // this.end2 = { x: x2, y: y2, z: z2 }

        this.zMin = Math.min(z, z2)
        this.zMax = Math.max(z, z2)

        assert(x === x2 || y === y2)

        this.base = []
        for (let _x of rng(Math.min(x, x2), Math.max(x, x2) + 1)) {
            for (let _y of rng(Math.min(y, y2), Math.max(y, y2) + 1)) {
                this.base.push(`${_x},${_y}`)
            }
        }

        this.supporters = []
        this.supports = []

        this.dropped = this.zMin === 1
    }

    setZMin(_zMin) {
        assert(_zMin >= 1)
        let diff = this.zMax - this.zMin
        this.zMin = _zMin
        this.zMax = _zMin + diff
    }

    hasBaseOverlap(b2) {
        if (b2 === this) { return false }
        return this.base.some(xy => b2.base.includes(xy))
    }

    hasVerticalOverlap(b2) {
        //            b2.zMin  b2.zMax
        // this.zMin                    this.zMax
        return this.zMin <= b2.zMax && this.zMax >= b2.zMin
    }   

    compare(b2) {
        if (!this.hasBaseOverlap(b2)) {
            return 0
        }

        if (this.zMin > b2.zMax) {
            return 1
        }

        return -1
    }

    isSupportFor(b2) {
        return b2.zMin === this.zMax + 1 && b2.hasBaseOverlap(this)
    }

    toString() {
        let { base, zMin, zMax } = this
        return sfy({ base, zMin, zMax })
    }
}

class Bricks {
    constructor(data) {
        this.bricks = data.split('\n').map(line => {
            let [x, y, z, x2, y2, z2] = line.match(/(\d+)/g).map(Number)
            return new Brick([x, y, z], [x2, y2, z2])
        })
    }

    below(b) {
        let overlaps = this.bricks.filter(_b => b.hasBaseOverlap(_b))
        return overlaps.filter(_b => _b.zMax < b.zMin)
    }

    dropAll() {
        let { bricks } = this

        while (true) {
            let undropped = bricks.filter(b => !b.dropped)
            if (undropped.length === 0) { break }

            for (let b of undropped) {
                let belows = this.below(b)
                if (belows.filter(_b => !_b.dropped).length === 0) {
                    let max = belows.map(_b => _b.zMax).max()
                    if (max  === -Infinity) { max = 0 }

                    b.setZMin(max + 1)
                    b.dropped = true
                }
            }
        }
        
        this.setSupports()
    }

    setSupports() {
        let { bricks } = this

        for (let b1 of bricks) {
            for (let b2 of bricks) {
                if (b1.isSupportFor(b2)) { b2.supporters.push(b1) }
                if (b2.isSupportFor(b1)) { b2.supports.push(b1) }
            }
        }

        // assert every brick is on ground or is supported
        assert(bricks.every(b => b.supporters.length > 0 || b.zMin === 1))
        
        // no bricks with overlapping bases overlap vertically
        for (let b1 of bricks) {
            for (let b2 of bricks) {
                if (b1 !== b2 && b1.hasBaseOverlap(b2)) {
                    assert(!b1.hasVerticalOverlap(b2))
                }
            }
        }

        for (let b1 of bricks) {
            for (let b2 of b1.supports) {
                assert(b1.isSupportFor(b2))
            }
            for (let b2 of b1.supporters) {
                assert(b2.isSupportFor(b1))
            }
        }

    }

    isSafe(brick) {
        return this.bricks.every(b => 
            b.supporters.length >= 2 || !b.supporters.includes(brick))
    }

    isSafe2(brick) {
        if (brick.supports.length === 0) { return true }
        return brick.supports.every(b => b.supporters.length >= 2)
    }

    safeBricks() {
        return this.bricks.filter(b => this.isSafe(b))
    }

    static log(bricks) {
        log(bricks.map(b => b.toString()).join('\n'))
    }
}

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let bricks = new Bricks(data)
bricks.dropAll()

// Bricks.log(bricks.safeBricks())
log(bricks.safeBricks().length)

// log(bricks.bricks.filter(b => bricks.isSafe2(b)).length)
// 495 is correct answer
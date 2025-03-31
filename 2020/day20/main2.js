const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// Need to write generate flipV, flipH, transpose functions

// https://adventofcode.com/2020/day/20
process.chdir('/Users/nmiles/source/aoc/2020/day20')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

function partToLines(x) {
    let [id, ...lines] = x.split('\n')
    id = parseInt(id.match(/Tile (\d+):/)[1])
    lines = lines.map(x => x.split(''))
    return { id, lines }
}

function linesToSqs(sq) {
    let { id, lines } = sq
    assert(lines && lines.length)
    return lines.allSymetries()
        .map((sym, i) => {
            assert(sym.length)
            return { id: 10*id+i, lines: sym } 
        })
}

function sideToInt(side) {
    let pow = 1
    let val = 0
    for (let i=0; i<side.length; i++) {
        if (side[i] === '#') {
            val += pow
        }
        pow *= 2
    }
    return val
}

const _top = 0
const _bottom = 1
const _left = 2
const _right = 3

let idToImage = new Map() // id => square

function addSides(sq) {
    let { id, lines } = sq
    idToImage.set(id, lines.trimBorder())

    let top = lines[0].join('')
    let bottom = lines[lines.length - 1].join('')
    let left = lines.map(x => x[0]).join('')
    let right = lines.map(x => x[x.length - 1]).join('')
    
    return { id, sides: [sideToInt(top), sideToInt(bottom), sideToInt(left), sideToInt(right)], lines }
}

let squares = data.split('\n\n').map(partToLines).flatMap(linesToSqs).map(addSides)
// log(squares[0], squares.length)

let ups = new Map() // id => ids of square that could be up
let rights = new Map() // id => ids of square that could be to the right
let downs = new Map() // id => ids of square that could be to the down

for (let {id, sides, lines} of squares) {
    for (let {id: id2, sides: sides2} of squares) {
        if (Math.floor(id / 10) === Math.floor(id2 / 10)) continue
        if (sides[_right] === sides2[_left]) { 
            rights.addToSet(id, id2) 
            assert(rights.get(id).size <= 1)
        }

        if (sides[_bottom] === sides2[_top]) { 
            downs.addToSet(id, id2) 
            assert(downs.get(id).size <= 1)
        }
    }
}

function goDown(id) {
    if (!downs.has(id)) return ''
    return [...downs.get(id)][0]
}

function goRight(id) {
    if (!rights.has(id)) return ''
    return [...rights.get(id)][0]
}

function downCount(id) {
    let count = 0
    while (true) {
        id = goDown(id)
        if (!id) break
        count++
    }
    return count
}

function rightCount(id) {
    let count = 0
    while (true) {
        id = goRight(id)
        if (!id) break
        count++
    }
    return count
}

let n = 12 // Image 12*12 array of 8*8 subimages
let imageCellSize = 8

let topLefts = squares.map(sq => sq.id).filter(id => downCount(id) === 11 && rightCount(id) === 11)

function placeSquares(sq) {
    let rows = []
    let row = []
    for (let i = 0; i < n; i++) {
        if (!sq) {
            return null
        }

        row.push(sq)
        sq = goRight(sq)
    }
    rows.push(row)

    for (let i = 0; i < n - 1; i++) {
        let row = []
        sq = goDown(rows[i][0])
        for (let j = 0; j < n; j++) {
            if (!sq) {
                return null
            }
            // if (goDown(rows[i][j]) !== sq) {
            //     return null
            // }

            row.push(sq)
            sq = goRight(sq)
        }
        rows.push(row)
    }

    return rows
}

rows = []

for (let sq of topLefts) {
    rows = placeSquares(sq)
    if (rows) break
}

assert(rows)

function buildImage(rows) {
    let image = []
    for (let row of rows) {
        let _lines = rng(imageCellSize).map(() => [])
        row.forEach(id => { 
            const _image = idToImage.get(id)
            _lines.push2D(_image) 
        })
        image = image.concat(_lines)
    }
    return image
}

let image = buildImage(rows)

function toRC(monster) { return monster.rcs().filter(([r,c]) => monster[r][c] === '#') }

let monsters = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `.split('\n').map(x => x.split('')).allSymetries().map(toRC)

function monsterRCs(monster, r, c) { return monster.map(([mr, mc]) => [r + mr, c + mc]) }

function matchMonster(rcs, image) { return rcs.every(([r, c]) => image[r] && image[r][c] === '#') }

function tallyMonster(rcs, monsterCells) { return rcs.forEach(([r, c]) => monsterCells.add(`${r},${c}`)) }

function tallyMonsters(image) {
    let monsterCells = new Set()

    image.rcs().forEach(([r, c]) => {
        for (let monster of monsters) {
            let mrcs = monsterRCs(monster, r, c)
            if (matchMonster(mrcs, image)) {
                tallyMonster(mrcs, monsterCells)
            }
        }
    })

    return monsterCells.size
}

let cellCount = image.rcs().filter(([r,c]) => image[r][c] === '#').length
let monsterCount = tallyMonsters(image)
log(cellCount, monsterCount, cellCount - monsterCount)

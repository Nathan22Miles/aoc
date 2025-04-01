const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// Need to write generate flipV, flipH, transpose functions

// https://adventofcode.com/2020/day/21
process.chdir('/Users/nmiles/source/aoc/2020/day21')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

function parseData(line) {
    const [ingredients, allergens] = line.split(' (contains ')
    const ingS = new Set(ingredients.split(' '))
    const algS = new Set(allergens.slice(0, -1).split(', '))
    return { ingS, algS }
}

let foods = data.split('\n').map(parseData)

// Determine which ingredients can't possibly contain any of the allergens in any food in your list. 
// In the above example, none of the ingredients kfcds, nhms, sbzzf, or trh can contain an allergen. 
// Counting the number of times any of these ingredients appear in any ingredients list 


function foodsToPossibelAlgS(_foods) {
    let _algToIngS = new Map()
    for (let { ingS, algS } of foods) {
        for (let alg of algS) {
            if (!_algToIngS.has(alg)) {
                _algToIngS.set(alg, ingS)
                continue
            }
            const _ingS = _algToIngS.get(alg)
            _algToIngS.set(alg, _ingS.and(ingS))
        }
    }
    return _algToIngS
}

let algToIngS = foodsToPossibelAlgS(foods)

let allAlgs = [...algToIngS.keys()]
let unsafeIngS = new Set(allAlgs.map(alg => algToIngS.get(alg)).flatMap(_ings => [..._ings]))

function safeIngs(food) {
    const {ingS} = food
    return [...ingS].filter(ing => !unsafeIngS.has(ing))
}

for (let food of foods) {
    food.ingS = food.ingS.and(unsafeIngS)
}
// foods.map(({ingS, algS}) => [[...ingS], [...algS]]).log()

function findMatch(algToIngS) {
    for (let [alg, ingS] of algToIngS.entries()) {
        if (ingS.size === 1) {
            return [alg, [...ingS][0]]
        }
    }
    return [null, null]
}

let algToIng = new Map()

while (true) {
    let algToIngS2 = foodsToPossibelAlgS(foods.filter(({algS}) => algS.size === 1))
    let [alg, ing] = findMatch(algToIngS2)
    if (!alg) break

    log('found match', alg, ing)
    algToIng.set(alg, ing)

    for (let food of foods) {
        food.ingS.delete(ing)
        food.algS.delete(alg)
    }
}

// algToIng.log()
log([...algToIng.keys()].sort().map(alg=>algToIng.get(alg)).join(','))
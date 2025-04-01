const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// Need to write generate flipV, flipH, transpose functions

// https://adventofcode.com/2020/day/22
process.chdir('/Users/nmiles/source/aoc/2020/day22')

// placing them on the bottom of their own deck so that the winner's card is above the other card.

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let decks = data.split('\n\n').map(x => x.split('\n').slice(1).map(Number))

function playGame(decks) {
    let round = 0
    while (decks[0].length > 0 && decks[1].length > 0) {
        round++
        let card1 = decks[0].shift()
        let card2 = decks[1].shift()
        if (card1 > card2) {
            decks[0].push(card1, card2)
        } else {
            decks[1].push(card2, card1)
        }
    }

    return decks[1].length > 0 ? decks[1] : decks[0]
}

function score(deck) {
    log(deck.map((x,i) => x * (deck.length - i)).sum())
}

let deck = playGame(decks)
deck.log()
score(deck)


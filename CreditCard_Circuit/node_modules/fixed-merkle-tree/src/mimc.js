const { mimc7 } = require('circomlib')
const { bigInt } = require('snarkjs')
module.exports = (left, right) => {
    return mimc7.multiHash([bigInt(left), bigInt(right)]).toString()
}
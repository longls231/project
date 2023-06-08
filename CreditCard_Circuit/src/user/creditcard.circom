// SPDX-License-Identifier: GPL-3.0
pragma circom 2.0.0;
include "../libs/hash.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";
/*
    This circuit is used to proof user is credit card owner
    Inputs:
    - creditCardNumber: 
    - creditCardExpireDate: card's expire time
    - creditCardCreationDate
    - cvv
    - bank: bank name
    
    - ownerName
    
    - userInfoHashed: hash(creditCardNumber, creditCardExpireDate, creditCardCreationDate, cvv, bank, ownerName)
    Public input:
    - ownerName
    - availableTime
    - key
    - root

*/
template CreadiCardVerifier() {
    signal input creditCardNumber;
    signal input creditCardExpireDate;
    signal input cvv;
    signal input bank;
    signal input ownerName;

    signal input amount;
    signal input userInfoHashed;
    signal input availableTime;
    signal output lastFourDigits;

    component leaf = Hash(5);
    leaf.in[0] <== creditCardNumber;
    leaf.in[1] <== creditCardExpireDate;
    leaf.in[2] <== cvv;
    leaf.in[3] <== bank;
    leaf.in[4] <== ownerName;

    userInfoHashed === leaf.out;

    lastFourDigits <-- creditCardNumber % 10000;
}

component main{public[bank, userInfoHashed, amount, availableTime]} = CreadiCardVerifier();

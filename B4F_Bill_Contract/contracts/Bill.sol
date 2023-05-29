// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Bill is Ownable {
    string private name;

    event BillSigned(bytes32 indexed bill, string indexed lastFour);
    mapping(bytes32 => uint256) public billSigned;
    mapping(bytes32 => string) public billLastFour;

    constructor(string memory _name) {
        name = _name;
    }

    function getName() external view returns (string memory) {
        return name;
    }

    function issue(bytes32 _bill, string memory _lastFour)
        public
        onlyOwner
    {
        billSigned[_bill] = block.number;
        billLastFour[_bill] = _lastFour;
        emit BillSigned(_bill, _lastFour);
    }

    function getBillBlock(bytes32 _bill)
        external
        view
        onlySigned(_bill)
        returns (uint256)
    {
        return billSigned[_bill];
    }

    function getBillLastFour(bytes32 _bill)
        external
        view
        onlySigned(_bill)
        returns (string memory)
    {
        return billLastFour[_bill];
    }

    function isSigned(bytes32 _bill) 
        public 
        view 
        returns (bool) 
    {
        return (billSigned[_bill] != 0);
    }

    modifier onlySigned(bytes32 _bill) {
        require(isSigned(_bill), "Error: Bill is not existed");
        _;
    }

}

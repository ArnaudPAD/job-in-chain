// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract JobInChainToken is ERC20, Ownable {
    address[] private minters;

    constructor(uint256 initialSupply) ERC20("JobInChain", "JIC") {
        _mint(msg.sender, initialSupply);
    }

    function addMinter(address minter) public onlyOwner {
        require(minter != address(0), "Minter address cannot be 0x0");
        require(!isMinter(minter), "Address is already a minter");

        minters.push(minter);

        emit MinterAdded(minter);
    }

    function isMinter(address account) public view returns (bool) {
        for (uint i = 0; i < minters.length; i++) {
            if (minters[i] == account) {
                return true;
            }
        }
        return false;
    }

    function mint(address account, uint256 amount) public onlyMinter {
        _mint(account, amount);
    }

    modifier onlyMinter() {
        require(isMinter(msg.sender), "Caller is not a minter");
        _;
    }

    event MinterAdded(address indexed account);
}

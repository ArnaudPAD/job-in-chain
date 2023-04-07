// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./UserManagement.sol";
import "./JobInChainToken.sol";

contract JobInChainTokenSale is Ownable, UserManagement {
    JobInChainToken private token;
    uint256 private rate;
    UserManagement private userManagement;
    uint256 private initialSupply;

    constructor(JobInChainToken _token, uint256 _rate, uint256 _initialSupply) {
        require(address(_token) != address(0), "Token address is not valid.");
        require(_rate > 0, "Rate should be greater than 0.");

        token = _token;
        rate = _rate;
        initialSupply = _initialSupply;
        // Appel du constructeur du contrat parent JobInChainToken avec l'initialisation de la supply
        token = new JobInChainToken(initialSupply);
    }

    function buyTokens() public payable {
        require(
            msg.value > 0,
            "Vous devez envoyer de l'ETH pour acheter des jetons JIC."
        );

        uint256 tokensToBuy = msg.value * rate;
        require(
            token.balanceOf(address(this)) >= tokensToBuy,
            "Il n'y a pas assez de jetons JIC disponibles."
        );

        // Transférer les jetons JIC de ce contrat à l'acheteur
        token.transfer(msg.sender, tokensToBuy);

        // Envoyer l'ETH reçu au propriétaire du contrat
        payable(owner()).transfer(msg.value);
    }

    function updateRate(uint256 _newRate) public onlyOwner {
        require(_newRate > 0, "Rate should be greater than 0.");
        rate = _newRate;
    }

    function withdrawTokens() public onlyOwner {
        uint256 remainingTokens = token.balanceOf(address(this));
        require(remainingTokens > 0, "No remaining tokens to withdraw.");

        token.transfer(owner(), remainingTokens);
    }

    function grantTokens(address _employee, uint256 _amount) public onlyOwner {
        require(_employee != address(0), "Invalid employee address");
        require(_amount > 0, "Amount should be greater than 0");

        uint256 remainingTokens = token.balanceOf(address(this));
        require(remainingTokens >= _amount, "Not enough JIC tokens available");

        token.transfer(_employee, _amount);
    }
}

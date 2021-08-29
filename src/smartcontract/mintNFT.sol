//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./contractChecker.sol";



contract MyNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    constructor() public ERC721("Xeonbit NFT test2", "xNFT") {}
    /**
     * @dev Mints `tokenId` and transfers it to `reciptient`.
     *
     * Requirements:
     *
     * - BalanceOf ERC20 is must more than 
    */
    
    function mintNFT(address recipient, string memory uri)
        public //external onlyOwner
        returns (uint256)
    {
        /*
        //Balancof ERC20 must more than 1000 DAI
        // ERC20 DAI contract on Kovan
        // 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD
        Check if the current address balance more than 1000 DAI
        1000000000000000000000 is the unit of 1000 DAI
        precision is 18 
        */
        Checker newCheck = new Checker();
        if (newCheck._checkBalERC20(0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD,recipient) < 1000000000000000000000) {
        revert("Not enough ERC20 provided.");
        }
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        uri = tokenURI(newItemId);
        return newItemId;
    }
    
    
}

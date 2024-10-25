// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Boxes is ERC721, ERC721Enumerable, Ownable {
    address public contests;

    modifier onlyContestContract {
        require(msg.sender == contests, "Contests: caller is not the contest contract");
        _;
    }

    constructor() 
        ERC721("Boxes", "BOXES")
        Ownable(msg.sender){}

    function setContests(address contests_) public onlyOwner {
        contests = contests_;
    }

    function mint (uint256 tokenId) public onlyContestContract {
        _safeMint(contests, tokenId);
    }

    function update (address to, uint256 tokenId, address auth) public onlyContestContract {
        _update(to, tokenId, auth);
    }
    
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getTokenIdContestNumber(uint256 tokenId) public pure returns (uint256) {
        return tokenId / 100;
    }
}
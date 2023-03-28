// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721URIStorage {
    uint256 public tokenCounter;
    mapping (address => uint256[]) public userNFTs;

    constructor() ERC721("MyNFT", "NFT") {
        tokenCounter = 0;
    }

    function mintNFT(string memory _url, address _to) public {
        uint256 _nftId = tokenCounter;
        _safeMint(_to, _nftId);
        _setTokenURI(_nftId, _url);
        userNFTs[_to].push(_nftId);
        tokenCounter = tokenCounter + 1;
    }

    function getUserNFTs(address user) public view returns (uint256[] memory) {
        return userNFTs[user];
    }
}

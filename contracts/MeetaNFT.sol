// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MeetaNFT is ERC721A, Ownable {
    constructor() ERC721A("Azuki", "AZUKI") {}

    using Strings for string;

    /**
     * @notice Max number of available nfts
     */
    uint32 private constant MAX_SUUPLY = 2000;

    /**
     * @notice Max number of available nfts
     */

    uint256 public currentSupply;

    string public s_baseURI;

    function _baseURI() internal view virtual override returns (string memory) {
        return s_baseURI;
    }


    function mint(uint256 quantity) external payable {
        // `_mint`'s second argument now takes in a `quantity`, not a `tokenId`.
        _mint(msg.sender, quantity);
    }
   /**
     * @notice Returns token URI for specifc one
     * @param tokenId token ID :)
    */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return string(abi.encodePacked(s_baseURI, tokenId.toString(), ".json"));
    }

    function withdraw() public onlyOwner {
		uint256 value = address(this).balance;
       bool sent = payable(owner()).send(value);
       require(sent, 'Error during withdraw transfer');
	}

    function setBaseURI(string calldata baseURI) external onlyOwner {
       s_baseURI = baseURI;
    }
}
   
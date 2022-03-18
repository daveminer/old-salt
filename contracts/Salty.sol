// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @custom:security-contact dave.miner@live.com
contract Salty is
    Initializable,
    ERC1155Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ERC1155BurnableUpgradeable,
    ERC1155SupplyUpgradeable
{
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct Keel {
        uint256 length;
        uint256 weight;
        uint8 curve;
    }

    struct Ship {
        uint256 signature;
    }

    Keel[] public keels;
    Ship[] public ships;

    mapping(uint256 => address) public keelToOwner;
    mapping(uint256 => address) public shipToOwner;
    mapping(address => uint256[]) public userOwnedKeels;
    mapping(address => uint256[]) public userOwnedShips;

    // Mix fungible and NFTs as suggested by the EIP-1155 proposal:
    // https://eips.ethereum.org/EIPS/eip-1155#non-fungible-tokens
    // First 128 bits denote the resource type, the other 128 are reserved for NFTs
    // uint256 baseTokenFT = 54321 << 128;
    // uint128 indexNFT = 50;
    // balanceOf(baseTokenNFT + indexNFT, msg.sender);

    // Fungibles start their index at 1
    uint256 public constant WOOD = 1 << 128;
    uint256 public constant TAR = 2 << 128;

    // TODO: replace with a secure method
    // Initializing a nonce for random numbers in development
    uint256 randNonce = 0;

    // struct Ship {
    //     uint256 holdSize;
    //     uint256 cannons;
    //     uint256 crew;
    //     uint256 sailArea;
    //     uint256 health;
    //     uint256 maxHealth;
    // }

    // mapping(uint256 => uint256) tokenIdToShipIndex;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {
        initialize();
    }

    function initialize() public initializer {
        __ERC1155_init("https://www.salty.crypto");
        __AccessControl_init();
        __Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(URI_SETTER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);

        //  Give all the resources to the origin account
        mint(msg.sender, WOOD, 10**6, "");
        mint(msg.sender, TAR, 10**6, "");
    }

    // Game functions

    // function buildMast(
    //     address account
    // ) public {
    //     // TODO: require and consume wood from caller
    //     // TODO: give caller a newly-minted mast
    //     _mint(account, WOOD, 1000000, "");
    // }

    function buildKeel(address _account) public {
        console.log("BUILDKEEL");
        // TODO: require and consume wood from caller

        keels.push(Keel(100, 100, 8));

        uint256 id = keels.length - 1;
        keelToOwner[id] = _account;
        userOwnedKeels[_account].push(id);
        //_mint(account, KEEL + keelCounter, 1, strBytes);
    }

    function buildShip(address _account) public {
        console.log("BUILDSHIP");

        ships.push(Ship(randMod()));
        uint256 id = ships.length - 1;
        shipToOwner[id] = _account;
        userOwnedShips[_account].push(id);
    }

    function userKeels(address _account)
        public
        view
        returns (uint256[] memory)
    {
        return userOwnedKeels[_account];
    }

    function userShips(address _account)
        public
        view
        returns (uint256[] memory)
    {
        return userOwnedShips[_account];
    }

    function userInventory(address _account)
        public
        view
        returns (uint256[] memory)
    {
        address[] memory accts = new address[](1);
        accts[0] = _account;

        uint256[] memory materials = new uint256[](1);
        materials[0] = WOOD;

        return balanceOfBatch(accts, materials);
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, data);
    }

    // TODO: replace this with a secure generation method; this is dev-only
    function randMod() internal returns (uint256) {
        randNonce++;
        return uint256(keccak256(abi.encodePacked(randNonce)));
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    )
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
        whenNotPaused
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

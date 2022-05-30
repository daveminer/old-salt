// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import {Voyage} from "./Voyage.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @custom:security-contact dave.miner@live.com
contract Salty is
    Initializable,
    ERC1155Upgradeable,
    AccessControlEnumerableUpgradeable,
    PausableUpgradeable,
    ERC1155BurnableUpgradeable,
    ERC1155SupplyUpgradeable
{
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Mix fungible and NFTs as suggested by the EIP-1155 proposal:
    // https://eips.ethereum.org/EIPS/eip-1155#non-fungible-tokens
    // First 128 bits denote the resource type, the other 128 are reserved for NFTs
    // uint256 baseTokenFT = 54321 << 128;
    // uint128 indexNFT = 50;
    // balanceOf(baseTokenNFT + indexNFT, msg.sender);

    // Fungibles start their index at 1
    uint256 public constant CREW = 1 << 128;
    uint256 public constant FOOD = 2 << 128;
    uint256 public constant FURS = 3 << 128;
    uint256 public constant GOLD = 4 << 128;
    uint256 public constant IRON = 5 << 128;
    uint256 public constant PORCELAIN = 6 << 128;
    uint256 public constant SPICE = 7 << 128;
    uint256 public constant WOOD = 8 << 128;
    uint256 public constant IRON_SHOT = 9 << 128;
    uint256 public constant STONE_SHOT = 10 << 128;

    // TODO: replace with a secure method
    // Initializing a nonce for random numbers in development
    uint256 randNonce = 0;

    struct Ship {
        uint256 beam;
        uint256 keel;
        uint256 shipLength;
        uint256 signature;
        uint256 sunk_at;
    }

    Ship[] public ships;

    mapping(uint256 => address) public shipToOwner;
    mapping(address => uint256[]) public userOwnedShips;

    // This should be in Voyage.sol but can't yet:
    // https://github.com/ethereum/solidity/pull/10996
    event VoyageComplete(
        address account,
        uint256 ship,
        bool success,
        uint256 reward
    );

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

        console.log(msg.sender, "INITIALIZING");

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(URI_SETTER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);

        //  Give all the resources to the origin account
        mint(msg.sender, CREW, 10**6, "");
        mint(msg.sender, FOOD, 10**6, "");
        mint(msg.sender, FURS, 10**6, "");
        mint(msg.sender, GOLD, 10**6, "");
        mint(msg.sender, IRON, 10**6, "");
        mint(msg.sender, PORCELAIN, 10**6, "");
        mint(msg.sender, SPICE, 10**6, "");
        mint(msg.sender, WOOD, 10**6, "");
        mint(msg.sender, IRON_SHOT, 10**6, "");
        mint(msg.sender, STONE_SHOT, 10**6, "");
    }

    function minter() private view returns (address) {
        return getRoleMember(MINTER_ROLE, 0);
    }

    function seedPlayerInventory(address _playerAccount)
        public
        onlyRole(MINTER_ROLE)
    {
        safeTransferFrom(msg.sender, _playerAccount, CREW, 15000, "");
        safeTransferFrom(msg.sender, _playerAccount, FOOD, 15000, "");
        safeTransferFrom(msg.sender, _playerAccount, FURS, 15000, "");
        safeTransferFrom(msg.sender, _playerAccount, GOLD, 15000, "");
        safeTransferFrom(msg.sender, _playerAccount, IRON, 15000, "");
        safeTransferFrom(msg.sender, _playerAccount, PORCELAIN, 15000, "");
        safeTransferFrom(msg.sender, _playerAccount, SPICE, 15000, "");
        safeTransferFrom(msg.sender, _playerAccount, WOOD, 15000, "");
        safeTransferFrom(msg.sender, _playerAccount, IRON_SHOT, 15000, "");
        safeTransferFrom(msg.sender, _playerAccount, STONE_SHOT, 15000, "");
    }

    // Game functions

    // function approveAll() public {
    //     setApprovalForAll(minter(), true);
    // }

    // function checkApproval() public view returns (bool) {
    //     console.log(msg.sender, "ALLOW");
    //     return isApprovedForAll(minter(), msg.sender);
    // }

    function buildShip(
        address _account,
        uint256 beamFactor,
        uint256 keelFactor,
        uint256 lengthFactor,
        uint256 _wood
    ) public {
        // TODO: require and consume wood from caller
        console.log(_account, "ACCOUNT");
        console.log(minter(), "MINT");

        removeShipMaterials(_account, _wood);

        uint256 appliedMaterial = calculateMaterialLoss(_wood);

        // Fuzz the dimensions 15%
        uint256 finalBeamValue = fuzzInt(appliedMaterial * beamFactor, 15);

        uint256 finalKeelValue = fuzzInt(appliedMaterial * keelFactor, 15);

        uint256 finalLengthValue = fuzzInt(appliedMaterial * lengthFactor, 15);

        // TODO: compute hit points, cannon points, speed, manuverability, hold size etc.

        ships.push(
            Ship(finalBeamValue, finalKeelValue, finalLengthValue, randMod(), 0)
        );
        uint256 id = ships.length - 1;
        shipToOwner[id] = _account;
        userOwnedShips[_account].push(id);
    }

    function embark(address _account, uint256 _ship) public {
        // TODO: ship must belong to account
        console.log(_ship, "SHIP");

        // random luck for outcomes of trip
        uint256 luckRoll = uint256(keccak256(abi.encodePacked(randNonce)));
        randNonce++;

        (uint256 sunk_at, uint256 dubEarned) = Voyage.voyage(luckRoll);
        if (dubEarned > 0) {
            _safeTransferFrom(minter(), _account, GOLD, dubEarned, "");
            emit VoyageComplete(_account, _ship, true, dubEarned);
            return;
        }

        // this ship sunk!
        Ship storage ship = ships[_ship];
        ship.sunk_at = sunk_at;

        emit VoyageComplete(_account, _ship, false, 0);
    }

    function removeShipMaterials(address _account, uint256 _wood) private {
        safeTransferFrom(_account, minter(), WOOD, _wood, "");
    }

    function calculateMaterialLoss(uint256 _wood) private returns (uint256) {
        uint256 lossRoll = randMod() % 50;

        return (_wood * lossRoll) / 100;
    }

    function userShips(address _account)
        public
        view
        returns (uint256[] memory)
    {
        return userOwnedShips[_account];
    }

    function crew(address _account) public view returns (uint256) {
        return balanceOf(_account, CREW);
    }

    function food(address _account) public view returns (uint256) {
        return balanceOf(_account, FOOD);
    }

    function furs(address _account) public view returns (uint256) {
        return balanceOf(_account, FURS);
    }

    function gold(address _account) public view returns (uint256) {
        return balanceOf(_account, GOLD);
    }

    function iron(address _account) public view returns (uint256) {
        return balanceOf(_account, IRON);
    }

    function porcelain(address _account) public view returns (uint256) {
        return balanceOf(_account, PORCELAIN);
    }

    function spice(address _account) public view returns (uint256) {
        return balanceOf(_account, SPICE);
    }

    function wood(address _account) public view returns (uint256) {
        return balanceOf(_account, WOOD);
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

    // TODO: not safe from over/underflow, validate inputs
    function fuzzInt(uint256 original, uint256 percentToFuzz)
        internal
        returns (uint256)
    {
        int256 modPercent = int256((randMod() % (percentToFuzz * 2))) - 15;
        int256 amountToFuzz = (int256(original) * modPercent) / 100;
        return original + uint256(amountToFuzz);
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
        override(ERC1155Upgradeable, AccessControlEnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

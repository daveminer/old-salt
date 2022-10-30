// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

//
// Chaos provides an application-specific wrapper around Chainlink VRF functions
//
abstract contract Chaos is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;

    // Chainlink subscription ID.
    uint64 s_subscriptionId;

    // Chainlink coordinator for BSC
    address vrfCoordinator = 0xc587d9053cd1118f25F645F9E08BB98c9712A4EE;

    // The Chainlink gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    // 200 gwei Key Hash:
    bytes32 s_keyHash =
        0x114f3da0a805b6a67d6e9cd2ec746f7028f1b7376365af575cfea3550dd1aa04;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // How many words to request from the randomness function.
    uint32 numWords = 6;

    // Custom progress value
    uint256 private constant ROLL_IN_PROGRESS = 42;

    // uint256[] public s_randomWords;
    // uint256 public s_requestId;
    address s_owner;

    // Maps requestID to address.
    mapping(uint256 => address) internal s_shipwrights;

    // Maps the shipwright to the ship randomness. Each ship receives 6 ordered
    // random uint256 that determines its properties.
    mapping(address => uint256[6][]) private s_results;

    event ShipBuild(uint256 indexed requestId, address indexed roller);
    event ShipBuildDone(uint256 indexed requestId, uint256[] indexed result);

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
    }

    // Chainlink needs this for subscription authorid20Valuezation
    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

    // Chainlink 'rollDice' function converted
    function rollShip(address _shipwright)
        public
        onlyOwner
        returns (uint256 requestId)
    {
        // Shipwright account must be in a state that is ready to roll a ship.
        require(readyToRoll(_shipwright));
        // If there is a pending roll it must be finished first.
        // TODO: this might need to check for all 0s to actually find a pending roll.
        require(s_results[_shipwright].length < 1, "Already rolled");

        // Request randomness and save the requestId
        requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        // Record the request id and link it to the user
        s_shipwrights[requestId] = _shipwright;

        // All 0s means roll in progress
        s_results[_shipwright].push([uint256(0), 0, 0, 0, 0, 0]);
        emit ShipBuild(requestId, _shipwright);
    }

    function readyToRoll(address shipwright) internal view returns (bool) {
        uint256[6] memory lastShip = lastVRFResults(shipwright);

        return lastShip[0] != 0;
    }

    function lastVRFResults(address _shipwright)
        internal
        view
        returns (uint256[6] storage)
    {
        uint256 lastIndex = s_results[_shipwright].length - 1;
        return s_results[_shipwright][lastIndex];
    }

    // function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
    //     internal
    //     override
    // {
    //     address shipwright = s_shipwrights[requestId];

    //     uint256[6] storage lastShip = lastBuild(shipwright);

    //     for (uint256 i = 0; i < lastShip.length; i++) {
    //         lastShip[i] = randomWords[i];
    //     }

    //     //white oak
    //     //https://www.quora.com/What-are-the-properties-of-wood-for-making-a-wooden-boat

    //     // emitting event to signal that dice landed
    //     emit ShipBuildDone(requestId, randomWords);
    // }
}

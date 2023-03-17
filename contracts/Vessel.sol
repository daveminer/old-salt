// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract Vessel {
    struct Ship {
        uint256 latitude;
        uint256 longitude;
        uint256 beam;
        //uint256 beamFactor;
        uint256 keel;
        //uint256 keelFactor;
        uint256 shipLength;
        //uint256 shipLengthFactor;
        uint256 balance;
        uint256 comfort;
        uint256 craftsmanship;
        uint256 design;
        uint256 spirit;
        uint256 hitPoints;
        uint256 cannonPoints;
        uint256 speed;
        uint256 maneuverability;
        uint256 holdSize;
        uint256 maxCrew;
        uint256 minCrew;
        uint256 sunkAt;
        uint256 woodUsed;
    }

    Ship[] public ships;

    mapping(uint256 => address) public shipToOwner;
    mapping(address => uint256[]) public userOwnedShips;

    function startShipBuild(
        address _account,
        uint256 _beamFactor,
        uint256 _keelFactor,
        uint256 _lengthFactor,
        uint256 _wood
    ) public {
        // Ship memory newShip = createShipPlaceholder(
        //     _beamFactor,
        //     _keelFactor,
        //     _lengthFactor,
        //     _wood
        // );
        // Add a new ship to the array
        // ships.push(newShip);
        // uint256 id = ships.length - 1;
        // // Map the ship by index to the builder's account
        // shipToOwner[id] = _account;
        // // Add the ship to the builder's array
        // userOwnedShips[_account].push(id);
        // return newShip;
    }

    function finishShipBuild(address _shipwright, uint256[] memory _vrfValues)
        public
    {
        Ship storage unfinishedShip = ships[lastShipIndex(_shipwright)];

        uint256 appliedMaterial = calculateMaterialLoss(
            unfinishedShip.woodUsed,
            _vrfValues[0]
        );

        // Fuzz the dimensions 15%
        uint256 finalBeamValue = fuzzInt(
            appliedMaterial * unfinishedShip.beamFactor,
            15,
            _vrfValues[1]
        );
        uint256 finalKeelValue = fuzzInt(
            appliedMaterial * unfinishedShip.keelFactor,
            15,
            _vrfValues[2]
        );
        uint256 finalLengthValue = fuzzInt(
            appliedMaterial * unfinishedShip.shipLengthFactor,
            15,
            _vrfValues[3]
        );

        // Hit points: beam * 5 + keel + 2
        // Beam ships have the most hit points, while keel ships don't do
        /// badly either. Length doesn't help at all.
        unfinishedShip.hitPoints = (finalBeamValue * 5) + (finalKeelValue * 2);

        // Cannon points: length * 2 + keel
        // Length ships bring additional potential firepower but not as
        // much as deep ships that risk many rows / low cannon ports.
        unfinishedShip.cannonPoints = finalLengthValue * 2 + finalKeelValue;

        // Speed: length * 3 - beam * 2 - keel
        // Length helps with speed and that's it..the others hurt speed
        // but beam hurts a good deal more than keel.
        unfinishedShip.speed =
            (finalLengthValue * 3) -
            (finalBeamValue * 2) -
            finalKeelValue;

        // beam * 4 - keel - length * 2
        // Beam actually helps maneuverability. The keel hurts a bit but
        // length hurts a lot. NOTE: balance should lessen the negative
        // effect of keel here.
        unfinishedShip.maneuverability =
            (finalBeamValue * 4) -
            finalKeelValue -
            (finalLengthValue * 2);

        // beam * 4 + keel * 2 + length
        // Beam adds the most space while keel adds a good amount too.
        // Length adds a fair amount comparatively.
        unfinishedShip.holdSize =
            (finalBeamValue * 4) +
            (finalKeelValue * 2) +
            finalLengthValue;

        unfinishedShip.maxCrew =
            (finalBeamValue * 4) +
            (finalKeelValue * 3) +
            finalLengthValue;

        unfinishedShip.minCrew = unfinishedShip.maxCrew / 2;
    }

    function calculateMaterialLoss(uint256 _wood, uint256 vrfValue)
        private
        pure
        returns (uint256)
    {
        uint256 lossRoll = vrfValue % 50;

        return (_wood * lossRoll) / 100;
    }

    function lastShipIndex(address shipwright) public view returns (uint256) {
        uint256 shipCount = userOwnedShips[shipwright].length;
        return userOwnedShips[shipwright][shipCount - 1];
    }

    function createShipPlaceholder(
        //uint256 _beamFactor,
        //uint256 _keelFactor,
        //uint256 _lengthFactor,
        uint256 _woodUsed
    ) private pure returns (Ship memory) {
        return
            Ship({
                latitude: 0,
                longitude: 0,
                beam: 0,
                //beamFactor: _beamFactor,
                keel: 0,
                //keelFactor: _keelFactor,
                shipLength: 0,
                //shipLengthFactor: _lengthFactor,
                balance: 0,
                comfort: 0,
                craftsmanship: 0,
                design: 0,
                spirit: 0,
                hitPoints: 0,
                cannonPoints: 0,
                speed: 0,
                maneuverability: 0,
                holdSize: 0,
                maxCrew: 0,
                minCrew: 0,
                sunkAt: 0,
                woodUsed: _woodUsed
            });
    }

    // TODO: this needs to be tested for overflow/bounds
    function fuzzInt(
        uint256 original,
        uint256 percentToFuzz,
        uint256 vrfValue
    ) private pure returns (uint256) {
        int256 modPercent = int256(
            (vrfValue % (percentToFuzz * 2)) - percentToFuzz
        );
        int256 amountToFuzz = (int256(original) * modPercent) / 100;
        return uint256(int256(original) + amountToFuzz);
    }
}

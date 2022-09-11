// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

library Vessel {
    struct Ship {
        uint256 beam;
        uint256 keel;
        uint256 shipLength;
        uint256 balance;
        uint256 comfort;
        uint256 craftsmanship;
        uint256 design;
        uint256 spirit;
        uint256 sunk_at;
    }

    function buildShip(
        uint256 _beamFactor,
        uint256 _keelFactor,
        uint256 _lengthFactor,
        uint256[] memory _vrfValues,
        uint256 _wood
    ) public pure returns (Ship memory) {
        uint256 appliedMaterial = calculateMaterialLoss(_wood, _vrfValues[0]);

        // Fuzz the dimensions 15%
        uint256 finalBeamValue = fuzzInt(
            appliedMaterial * _beamFactor,
            15,
            _vrfValues[1]
        );
        uint256 finalKeelValue = fuzzInt(
            appliedMaterial * _keelFactor,
            15,
            _vrfValues[2]
        );
        uint256 finalLengthValue = fuzzInt(
            appliedMaterial * _lengthFactor,
            15,
            _vrfValues[3]
        );

        //uint256 signature = randMod();

        // uint256 hitPoints = finalLengthValue +
        //     (finalBeamValue * 5) +
        //     (finalKeelValue * 2);

        // uint256 cannonPoints = finalLengthValue * 2 + finalKeelValue;

        // uint256 speed = (finalLengthValue * 3) -
        //     (finalBeamValue * 2) -
        //     finalKeelValue;

        // uint256 maneuverability = (finalBeamValue * 4) -
        //     finalKeelValue -
        //     (finalLengthValue * 2);

        // uint256 holdSize = (finalBeamValue * 4) +
        //     (finalKeelValue * 2) +
        //     finalLengthValue;

        return
            createShipPlaceholder(
                finalBeamValue,
                finalKeelValue,
                finalLengthValue
            );
    }

    function calculateMaterialLoss(uint256 _wood, uint256 vrfValue)
        private
        pure
        returns (uint256)
    {
        uint256 lossRoll = vrfValue % 50;

        return (_wood * lossRoll) / 100;
    }

    function createShipPlaceholder(
        uint256 _beam,
        uint256 _keel,
        uint256 _length
    ) private pure returns (Ship memory) {
        return
            Ship({
                beam: _beam,
                keel: _keel,
                shipLength: _length,
                balance: 0,
                comfort: 0,
                craftsmanship: 0,
                design: 0,
                spirit: 0,
                sunk_at: 0
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

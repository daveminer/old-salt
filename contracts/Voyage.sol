// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

library Voyage {
    function voyage(uint256 _luckRoll)
        internal
        view
        returns (uint256, uint256)
    {
        // lose resources (crew, food, ship,  etc.)
        uint64[4] memory luckSections = marshallLuckRoll(_luckRoll);

        bool success = successCheck(luckSections[0]);
        uint256 earnings = 0;
        uint256 sunk_at = 0;

        if (success == true) {
            earnings = 10;
        } else {
            sunk_at = block.number;
        }

        return (sunk_at, earnings);
    }

    function marshallLuckRoll(uint256 luckRoll)
        private
        pure
        returns (uint64[4] memory)
    {
        uint128 firstHalf = uint128(luckRoll >> 128);
        uint128 lastHalf = uint128(luckRoll);

        uint64 firstQuarter = uint64(firstHalf >> 64);
        uint64 secondQuarter = uint64(firstHalf);
        uint64 thirdQuarter = uint64(lastHalf >> 64);
        uint64 fourthQuarter = uint64(lastHalf);

        return [firstQuarter, secondQuarter, thirdQuarter, fourthQuarter];
    }

    function successCheck(uint64 successLuck) private pure returns (bool) {
        return successLuck % 2 > 0;
    }
}

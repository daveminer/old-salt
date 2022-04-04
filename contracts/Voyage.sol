// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

library Voyage {
    function voyage(uint256 _luckRoll) internal pure returns (uint8) {
        // lose resources (crew, food etc.)
        uint64[4] memory luckSections = marshallLuckRoll(_luckRoll);

        bool success = successCheck(luckSections[0]);
        uint8 earnings = 0;

        if (success == true) {
            earnings = 10;
        }

        return earnings;
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

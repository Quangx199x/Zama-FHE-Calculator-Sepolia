// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title A simple FHE calculator contract for encrypted addition/subtraction
contract FHECalculator is SepoliaConfig {
    euint32 private _result;

    /// @notice Returns the current result
    function getResult() external view returns (euint32) {
        return _result;
    }

    /// @notice Adds an encrypted value to the result
    function add(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        euint32 evalue = FHE.fromExternal(inputEuint32, inputProof);
        _result = FHE.add(_result, evalue);
        FHE.allowThis(_result);
        FHE.allow(_result, msg.sender);
    }

    /// @notice Subtracts an encrypted value from the result
    function subtract(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        euint32 evalue = FHE.fromExternal(inputEuint32, inputProof);
        _result = FHE.sub(_result, evalue);
        FHE.allowThis(_result);
        FHE.allow(_result, msg.sender);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SignalAnchor
 * @dev Minimal contract to anchor CuratoBase agent signals on Base.
 *      Used to prove that a specific curation snapshot existed at a specific time.
 */
contract SignalAnchor {
    // Event emitted when the agent publishes a cycle digest
    event SignalAnchored(
        string indexed castHash,
        uint8 verdict,
        uint16 confidenceBps,
        string verificationHash,
        string version,
        uint256 timestamp
    );

    /**
     * @notice Anchors a digest (keccak256 hash of curation snapshot) on-chain
     */
    function anchor(
        string memory castHash,
        uint8 verdict,
        uint16 confidenceBps,
        string memory verificationHash,
        string memory version
    ) external {
        emit SignalAnchored(castHash, verdict, confidenceBps, verificationHash, version, block.timestamp);
    }
}

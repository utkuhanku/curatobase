// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title CuratoBase Revenue Agent
 * @notice Accepts payments for signals and funds the autonomous compute wallet.
 */
contract CuratoRevenue {
    address public owner;           // The deployer (Cold Storage / Admin)
    address public computeWallet;   // The autonomous agent wallet

    event PaymentReceived(address indexed sender, uint256 amount);
    event ComputeFunded(uint256 amount, uint256 timestamp);
    event ComputeWalletUpdated(address indexed oldWallet, address indexed newWallet);

    constructor(address _computeWallet) {
        owner = msg.sender;
        computeWallet = _computeWallet;
    }

    /**
     * @notice Accept ETH payments.
     * @dev Emit event for the API to verify payment.
     */
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    /**
     * @notice Withdraw ETH to the Compute Wallet to pay for gas.
     * @param amount Amount to withdraw in wei.
     */
    function fundCompute(uint256 amount) external {
        require(msg.sender == owner || msg.sender == computeWallet, "Unauthorized");
        require(address(this).balance >= amount, "Insufficient funds");

        (bool success, ) = computeWallet.call{value: amount}("");
        require(success, "Transfer failed");

        emit ComputeFunded(amount, block.timestamp);
    }

    /**
     * @notice Emergency withdraw to owner.
     */
    function withdrawAll() external {
        require(msg.sender == owner, "Only owner");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    /**
     * @notice Update the compute wallet address (if key is compromised/rotated).
     */
    function setComputeWallet(address _newWallet) external {
        require(msg.sender == owner, "Only owner");
        emit ComputeWalletUpdated(computeWallet, _newWallet);
        computeWallet = _newWallet;
    }
}

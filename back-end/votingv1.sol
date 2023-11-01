// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    // Structure to represent a voter
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

    // Structure to represent a proposal
    struct Proposal {
        string name;
        uint256 voteCount;
    }

    address public chairperson;
    mapping(address => Voter) public voters;
    Proposal[] public proposals;

    // Create a new voting contract with a list of proposal names
    constructor(string[] memory proposalNames) {
        chairperson = msg.sender;
        voters[chairperson].isRegistered = true;

        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    // Register to vote (open to anyone)
    function register() public {
        require(!voters[msg.sender].isRegistered, "You are already registered.");
        voters[msg.sender].isRegistered = true;
    }

    // Vote for a proposal
    function vote(uint256 proposalId) public {
        Voter storage sender = voters[msg.sender];
        require(sender.isRegistered, "You must be registered to vote.");
        require(!sender.hasVoted, "You have already voted.");
        require(proposalId < proposals.length, "Invalid proposal ID.");

        sender.hasVoted = true;
        sender.votedProposalId = proposalId;
        proposals[proposalId].voteCount += 1;
    }

    // Tally the votes and get the winning proposal
    function winningProposal() public view returns (uint256 proposalId) {
        uint256 maxVoteCount = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxVoteCount) {
                maxVoteCount = proposals[i].voteCount;
                proposalId = i;
            }
        }
    }

    // Get the name of the winning proposal
    function winningProposalName() public view returns (string memory) {
        uint256 proposalId = winningProposal();
        return proposals[proposalId].name;
    }
}
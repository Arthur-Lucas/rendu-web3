// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Vote {
    struct Candidate {
        string name;
        uint voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    constructor(string[] memory candidateNames) {
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], 0));
        }
    }

    function voteByName(string memory candidateName) public {
        require(!hasVoted[msg.sender], "Vous avez deja vote.");

        uint candidateIndex = candidates.length;
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(bytes(candidates[i].name)) == keccak256(bytes(candidateName))) {
                candidateIndex = i;
                break;
            }
        }
        require(candidateIndex < candidates.length, "Le candidat n'existe pas.");

        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount += 1;
    }

    function getCandidates() public view returns (string[] memory) {
        string[] memory names = new string[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            names[i] = candidates[i].name;
        }
        return names;
    }

    function getResults() public view returns (string[] memory names, uint[] memory voteCounts) {
        uint len = candidates.length;
        names = new string[](len);
        voteCounts = new uint[](len);

        for (uint i = 0; i < len; i++) {
            names[i] = candidates[i].name;
            voteCounts[i] = candidates[i].voteCount;
        }

        return (names, voteCounts);
    }

    function getCandidateCount() public view returns (uint) {
        return candidates.length;
    }
}

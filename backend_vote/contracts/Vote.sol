// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Vote {
    struct Candidate {
        string name;
        uint voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    address[] public voters;
    uint public totalVotes;
    uint public constant MAX_VOTES = 2;

    constructor(string[] memory candidateNames) {
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], 0));
        }
    }

    function resetVotes() public {
        for (uint i = 0; i < candidates.length; i++) {
            candidates[i].voteCount = 0;
        }
        for (uint i = 0; i < voters.length; i++) {
            hasVoted[voters[i]] = false;
        }
        totalVotes = 0;
        delete voters;
    }

    function hasAlreadyVoted() public view returns (bool) {
        return hasVoted[msg.sender];
    }

    function isEqual() public view returns (bool) {
        if (totalVotes < MAX_VOTES) {
            return false;
        }
        // Cherche les deux scores les plus élevés
        uint first = 0;
        uint second = 0;
        for (uint i = 0; i < candidates.length; i++) {
            uint votes = candidates[i].voteCount;
            if (votes > first) {
                second = first;
                first = votes;
            } else if (votes > second) {
                second = votes;
            }
        }
        return (first == second && first != 0);
    }

    function voteByName(string memory candidateName) public {
        require(!hasVoted[msg.sender], "Vous avez deja vote.");
        require(totalVotes < MAX_VOTES, "Le nombre maximum de votes a ete atteint.");
        uint candidateIndex = candidates.length;
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(bytes(candidates[i].name)) == keccak256(bytes(candidateName))) {
                candidateIndex = i;
                break;
            }
        }
        require(candidateIndex < candidates.length, "Le candidat n'existe pas.");

        hasVoted[msg.sender] = true;
        voters.push(msg.sender);
        totalVotes += 1;
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

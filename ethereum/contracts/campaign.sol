// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) external {
        Campaign newCampaign = new Campaign(minimum, msg.sender);        
        deployedCampaigns.push(address(newCampaign));
    }
    
    function getDeployedContracts() external view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    mapping(uint => Request) public requests;
    uint public requestCount;
    uint public approversCount;
    
    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() external payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(
        string memory description,
        uint value,
        address recipient) external managerOnly
    {
        Request storage newRequest = requests[requestCount];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        
        requestCount++;
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    } 
    
    function finalizeRequest(uint index) public managerOnly {
        Request storage request = requests[index];
        
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));
        
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

    function getSummary() external view returns (
      uint,
      uint,
      uint,
      uint,
      address
    ) {
      return (
        minimumContribution,
        address(this).balance,
        requestCount,
        approversCount,
        manager
      );
    }
}
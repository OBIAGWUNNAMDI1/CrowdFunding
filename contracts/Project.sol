//SPDX-License-Identifier: MIT
/// @title A crowdfunding project deployed on polygon network that uses theta token as the means of payment for contribution.
///The contract will create a project in which people can contibute towards the funding of the project.
pragma solidity ^0.8.4;
import "./IERC20.sol";
contract ProjectCreated {
    //tell us the the state of the Project
    enum ProjectState{
        Fundraising,
        Expired,
        Completed
    }
    address Theta = 0x3883f5e181fccaF8410FA61e12b59BAd963fb645;
    //creating an instance of the Theta token

    address payable creator;
    struct Funding{
        uint256 goalAmount;
        uint256 currentRaised;
        address contributor;
        uint40 raisingDeadline;
        }

    address[] public contributors;
    string projectTitle;
    //initialise state at fundraising
    ProjectState public State = ProjectState.Fundraising;
    mapping (address => uint) contributions;
    mapping(address => Funding)Funders;

    //Events
    event RecieveContribution(address contributor, uint amount, uint currentTotal);
    event CreatorPaid(address recipient);

    //modifiers
    modifier theState(ProjectState _state){
        require(State == _state);
        _;
    }
    constructor (
        address payable Creator,
        string memory _projectTitle
        ){
        creator = Creator;
        projectTitle = _projectTitle;
    }

    function contributeFunds(uint256 amount) external theState(ProjectState.Fundraising) payable{
        IERC20(Theta).transferFrom(msg.sender, address(this), amount);
        contributions[msg.sender] +=amount;
        Funding storage funds = Funders[msg.sender];
        funds.currentRaised += amount;
        funds.raisingDeadline = uint40(block.timestamp + 5 days); 
        contributors.push(msg.sender);
        emit RecieveContribution(msg.sender, amount, funds.currentRaised);
    }
    function checkFundingExpired() internal{
        Funding storage funds = Funders[msg.sender];
        if (block.timestamp ==funds.raisingDeadline){
            State = ProjectState.Expired;
        }
    }
    function payout() external returns(bool result){
        require(msg.sender == creator);
        Funding storage funds = Funders[msg.sender];
        uint256 totalRaised = funds.currentRaised;
        funds.currentRaised = 0 ;
        contributions[address(this)] -= totalRaised;

        if (IERC20(Theta).transfer(msg.sender , totalRaised)){
            emit CreatorPaid(creator);
            State = ProjectState.Completed;
            return true;
        }
        else{
            funds.currentRaised = totalRaised;
            State = ProjectState.Completed;
            }
            return false ;
    }

    function getDetails(address _contributors) public view returns(Funding memory funds){
        funds = Funders[_contributors];
    }
}

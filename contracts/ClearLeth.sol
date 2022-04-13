// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ClearLeth {
    address public contractOwner;

    address[] employers;
    address[] employees;
    address[] authorities;

    mapping(address => user) public addressToUser;

    mapping(address => address) public employeeToEmployer;
    mapping(address => address[]) public employerToEmployee;

    uint256 public numOfEmployees = 0;
    uint256 public numOfEmployers = 0;
    uint256 public numOfAuthorities = 0;

    enum role {
        employee,
        employer,
        authority
    }

    enum leaveStatus {
        pending,
        cancelled,
        approved,
        rejected
    }

    struct user {
        string name;
        address wallet;
        string company;
        role role;
    }

    struct leave {
        uint256 id;
        uint256 date; // UNIX
        bytes32 reason;
        leaveStatus status;
        address employee;
    }

    uint256 public leaveAmount;
    uint256 public numLeaves = 0;
    leave[] allLeaves;

    mapping(address => leave[]) employeeToLeaves;
    mapping(address => uint256) employeeLeaveBalance;
    mapping(uint256 => uint256) datesToEmployeesApplied;
    mapping(address => uint256) employersToLeaveLimit;

    event LeaveApplied(address employee);
    event LeaveApproved(address employee, address employer, uint256 leaveId);
    event LeaveCancelled(address employee, uint256 leaveId);
    event LeaveRejected(address employee, address employer, uint256 leaveId);
    event LeaveLimitSet(address employer, uint256 limit);

    // @dev Owner of contract will be able to add employers and is an employer
    // @dev leaveAmount is also set when deployed
    constructor(uint256 _leaveAmount) {
        contractOwner = msg.sender;
        employers.push(msg.sender);
        numOfEmployers++;

        // new user object
        user memory newUser = user("Owner", msg.sender, "NUS", role.employer);

        addressToUser[msg.sender] = newUser;
        leaveAmount = _leaveAmount;
    }

    modifier employerOnly(address employeeAddress) {
        require(
            employeeToEmployer[employeeAddress] == msg.sender,
            "Only employer of this employee can call this function"
        );
        _;
    }

    modifier isOwner() {
        require(
            contractOwner == msg.sender,
            "Only the contract owner can call this function"
        );
        _;
    }

    modifier isEmployer() {
        require(
            addressToUser[msg.sender].role == role.employer,
            "Only an employer can call this function"
        );
        _;
    }

    modifier isEmployee() {
        require(
            addressToUser[msg.sender].role == role.employee,
            "Only employees can call this function"
        );
        _;
    }

    modifier isAuthority() {
        require(
            addressToUser[msg.sender].role == role.authority,
            "Only authorities can call this function"
        );
        _;
    }

    modifier validLeaveId(uint256 leaveId) {
        require(leaveId < numLeaves, "Not Valid Leave Id");
        _;
    }

    modifier validLeaveStatus(leave memory leaveApplication) {
        require(
            leaveApplication.status == leaveStatus.pending,
            "Leave is not pending"
        );
        _;
    }

    modifier isEmployeeOfLeave(leave memory _leave) {
        require(
            _leave.employee == msg.sender,
            "Only employee of this leave can call this function"
        );
        _;
    }

    // CHECK IF USER HAS ALREADY BEEN ADDED
    modifier notAdded(address _employerAddress) {
        require(
            addressToUser[_employerAddress].wallet == address(0),
            "User has already been added!"
        );
        _;
    }

    function getUser() public view returns (user memory) {
        return addressToUser[msg.sender];
    }

    function getUserNameOf(address _userAddress)
        public
        view
        returns (string memory)
    {
        return addressToUser[_userAddress].name;
    }

    function addEmployer(
        string memory _company,
        string memory _employerName,
        address _employerAddress
    ) public isEmployer notAdded(_employerAddress) {
        employers.push(_employerAddress);

        // new user object
        user memory newUser = user(
            _employerName,
            _employerAddress,
            _company,
            role.employer
        );

        addressToUser[_employerAddress] = newUser;
        numOfEmployers++;
    }

    function addEmployee(string memory _employeeName, address _employeeAddress)
        public
        isEmployer
        notAdded(_employeeAddress)
    {
        employees.push(_employeeAddress);

        // new user object
        string memory company = addressToUser[msg.sender].company;
        user memory newUser = user(
            _employeeName,
            msg.sender,
            company,
            role.employee
        );

        addressToUser[_employeeAddress] = newUser;
        employerToEmployee[msg.sender].push(_employeeAddress);
        employeeToEmployer[_employeeAddress] = msg.sender;
        employeeLeaveBalance[_employeeAddress] = leaveAmount;
        numOfEmployees++;
    }

    function addAuthority(
        string memory _authorityName,
        address _authorityAddress
    ) public isOwner notAdded(_authorityAddress) {
        authorities.push(_authorityAddress);

        // new user object
        user memory newUser = user(
            _authorityName,
            msg.sender,
            "",
            role.authority
        );

        addressToUser[_authorityAddress] = newUser;
        numOfAuthorities++;
    }

    // @dev would be better if we just update mapping employees to false
    // then when we do getEmployees if wont appear
    function removeEmployee(address _employeeAddress)
        public
        employerOnly(_employeeAddress)
    {
        for (uint256 i = 0; i < employees.length; i++) {
            if (employees[i] == _employeeAddress) {
                employees[i] = employees[employees.length - 1];
                employees.pop();
            }
        }

        for (uint256 j = 0; j < employerToEmployee[msg.sender].length; j++) {
            if (employerToEmployee[msg.sender][j] == _employeeAddress) {
                employerToEmployee[msg.sender][j] = employerToEmployee[
                    msg.sender
                ][employerToEmployee[msg.sender].length - 1];
                employerToEmployee[msg.sender].pop();
            }
        }

        delete addressToUser[_employeeAddress];
        delete employeeToEmployer[_employeeAddress];
        delete employeeToLeaves[_employeeAddress];
        delete employeeLeaveBalance[_employeeAddress];
        numOfEmployees--;
    }

    function getEmployeesByEmployer(address _employerAddress)
        public
        view
        returns (address[] memory)
    {
        return employerToEmployee[_employerAddress];
    }

    // @dev transfer complexity to view function no gas
    function getAllEmployees() public view returns (address[] memory) {
        address[] memory employeeArray = new address[](numOfEmployees);
        for (uint256 i = 0; i < numOfEmployees; i++) {
            employeeArray[i] = employees[i];
        }

        return employeeArray;
    }

    // @dev transfer complexity to view function no gas
    function getAllEmployers() public view returns (address[] memory) {
        address[] memory employerArray = new address[](numOfEmployers);
        for (uint256 i = 0; i < numOfEmployers; i++) {
            employerArray[i] = employers[i];
        }

        return employerArray;
    }

    // @dev transfer complexity to view function no gas
    function getAllAuthorities() public view returns (address[] memory) {
        address[] memory authoritiesArray = new address[](numOfAuthorities);
        for (uint256 i = 0; i < numOfAuthorities; i++) {
            authoritiesArray[i] = authorities[i];
        }
        return authoritiesArray;
    }

    function applyLeaves(uint256[] memory dates, bytes32[] memory reason)
        public
        isEmployee
    {
        for (uint256 i = 0; i < dates.length; i++) {
            leave memory newLeave = leave(
                numLeaves,
                dates[i],
                reason[i],
                leaveStatus.pending,
                msg.sender
            );

            numLeaves++;
            employeeToLeaves[msg.sender].push(newLeave);
            allLeaves.push(newLeave);
        }

        emit LeaveApplied(msg.sender);
    }

    function cancelLeave(leave memory _leave)
        public
        validLeaveStatus(_leave)
        isEmployeeOfLeave(_leave)
    {
        for (uint256 i = 0; i < employeeToLeaves[msg.sender].length; i++) {
            if (employeeToLeaves[msg.sender][i].id == _leave.id) {
                employeeToLeaves[msg.sender][i].status = leaveStatus.cancelled;
            }
        }
        emit LeaveCancelled(msg.sender, _leave.id);
    }

    function approveLeave(leave memory leaveToApprove)
        public
        validLeaveId(leaveToApprove.id)
        validLeaveStatus(leaveToApprove)
        employerOnly(leaveToApprove.employee)
    {
        address employeeAddress = leaveToApprove.employee;
        for (uint256 i = 0; i < employeeToLeaves[employeeAddress].length; i++) {
            if (employeeToLeaves[employeeAddress][i].id == leaveToApprove.id) {
                employeeToLeaves[employeeAddress][i].status = leaveStatus
                    .approved;
            }
        }

        for (uint256 j = 0; j < allLeaves.length; j++) {
            if (allLeaves[j].id == leaveToApprove.id) {
                allLeaves[j].status = leaveStatus.approved;
            }
        }

        datesToEmployeesApplied[leaveToApprove.date]++;
        employeeLeaveBalance[employeeAddress]--;
        emit LeaveApproved(employeeAddress, msg.sender, leaveToApprove.id);
    }

    function rejectLeave(leave memory leaveToReject)
        public
        validLeaveId(leaveToReject.id)
        validLeaveStatus(leaveToReject)
        employerOnly(leaveToReject.employee)
    {
        address employeeAddress = leaveToReject.employee;
        for (uint256 i = 0; i < employeeToLeaves[employeeAddress].length; i++) {
            if (employeeToLeaves[employeeAddress][i].id == leaveToReject.id) {
                employeeToLeaves[employeeAddress][i].status = leaveStatus
                    .rejected;
            }
        }

        for (uint256 j = 0; j < allLeaves.length; j++) {
            if (allLeaves[j].id == leaveToReject.id) {
                allLeaves[j].status = leaveStatus.rejected;
            }
        }
        emit LeaveRejected(employeeAddress, msg.sender, leaveToReject.id);
    }

    function getLeaveBalance() public view returns (uint256) {
        return employeeLeaveBalance[msg.sender];
    }

    // this method i think cannot return a struct? - ryan
    function getLeaveInformation(uint256 leaveId)
        public
        view
        returns (leave memory)
    {
        for (uint256 i = 0; i < allLeaves.length; i++) {
            if (allLeaves[i].id == leaveId) {
                return allLeaves[i];
            }
        }
        revert("Leave not found");
    }

    function getLeaveApplications(address employeeAddress)
        public
        view
        returns (leave[] memory)
    {
        return employeeToLeaves[employeeAddress];
    }

    function setLeaveLimit(address employerAddress, uint256 limit) public {
        emit LeaveLimitSet(employerAddress, limit);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ClearLeth {
    address public contractOwner;

    address[] employers;
    address[] employees;
    address[] authorities;

    mapping(address => role) addressToRole;

    mapping(address => address) employeeToEmployer;
    mapping(address => address[]) employerToEmployee;

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

    event LeaveApplied(address employee, uint256 date);
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
        addressToRole[msg.sender] = role.employer;
        leaveAmount = _leaveAmount;
    }

    modifier employerOnly(address employeeAddress) {
        require(
            employeeToEmployer[employeeAddress] == msg.sender,
            "Only employer of this employee can call this function"
        );
        _;
    }

    modifier notSelf(address toAdd) {
        require(
            toAdd != msg.sender,
            "You cannot add yourself!"
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
            addressToRole[msg.sender] == role.employer,
            "Only an employer can call this function"
        );
        _;
    }

    modifier isEmployee() {
        require(
            addressToRole[msg.sender] == role.employee,
            "Only employees can call this function"
        );
        _;
    }

    modifier isAuthority() {
        require(
            addressToRole[msg.sender] == role.authority,
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

    function addEmployer(address _employerAddress) public isEmployer {
        employers.push(_employerAddress);
        addressToRole[_employerAddress] = role.employer;
        numOfEmployers++;
    }

    function addEmployee(address _employeeAddress) public isEmployer notSelf(_employeeAddress) {
        employees.push(_employeeAddress);
        addressToRole[_employeeAddress] = role.employee;
        employerToEmployee[msg.sender].push(_employeeAddress);
        employeeToEmployer[_employeeAddress] = msg.sender;
        employeeLeaveBalance[_employeeAddress] = leaveAmount;
        numOfEmployees++;
    }

    function addAuthority(address _authorityAddress) public isOwner {
        authorities.push(_authorityAddress);
        addressToRole[_authorityAddress] = role.authority;
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

        delete addressToRole[_employeeAddress];
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

    function applyLeave(uint256 date, bytes32 reason) public isEmployee {
        leave memory newLeave = leave(
            numLeaves,
            date,
            reason,
            leaveStatus.pending,
            msg.sender
        );

        numLeaves++;
        employeeToLeaves[msg.sender].push(newLeave);
        allLeaves.push(newLeave);
        emit LeaveApplied(msg.sender, date);
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

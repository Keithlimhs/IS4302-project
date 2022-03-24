// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ClearLeth {
  address[] public registeredAddresses;
  mapping(address => bool) employers;
  mapping(address => bool) employees;
  mapping(address => address) employeeToEmployer;
  mapping(address => address[]) employerToEmployee;
  uint public numOfEmployees = 0;
  uint public numOfEmployers = 0;

  enum leaveStatus { pending, cancelled, approved, rejected }
  struct leave {
    uint id;
    string date; //can look into using timestamp
    string reason;
    leaveStatus status;
    address employee;
  }

  uint public leaveAmount;
  uint public numLeaves = 0;
  leave[] allLeaves;
  mapping(address => leave[]) employeeToLeaves;
  mapping(address => uint) employeeLeaveBalance;
  mapping(string => uint) datesToEmployeesApplied;
  mapping(address => uint) employersToLeaveLimit;

  event LeaveApplied(address employee, string date);
  event LeaveApproved(address employee, address employer, uint leaveId);
  event LeaveCancelled(address employee, uint leaveId);
  event LeaveRejected(address employee, address employer, uint leaveId);
  event LeaveLimitSet(address employer, uint limit);

  // @dev Owner of contract will be able to add employers and is an employer
  // @dev leaveAmount is also set when deployed
  constructor(uint _leaveAmount) {
    registeredAddresses.push(msg.sender);
    numOfEmployers++;
    employers[msg.sender] = true;
    leaveAmount = _leaveAmount;
  }

  modifier validLeaveId(uint leaveId) {
    require(leaveId < numLeaves, "Not Valid Leave Id");
    _;
  }

  modifier employerOnly(address employeeAddress) {
    require(employeeToEmployer[employeeAddress] == msg.sender, "Only employer of this employee can call this function");
    _;
  }

  modifier isEmployer() {
    require(employers[msg.sender] == true, "Only an employer can call this function");
    _;
  }

  modifier validLeaveStatus(leave memory leaveApplication) {
    require(leaveApplication.status == leaveStatus.pending, "Leave is not valid");
    _;
  }

  function addEmployer(address _employerAddress) public isEmployer() {
    registeredAddresses.push(_employerAddress);
    employers[_employerAddress] = true;
    numOfEmployers++;
  }

  function addEmployee(address _employeeAddress) public isEmployer() {
    registeredAddresses.push(_employeeAddress);
    employees[_employeeAddress] = true;
    employerToEmployee[msg.sender].push(_employeeAddress);
    employeeToEmployer[_employeeAddress] = msg.sender;
    employeeLeaveBalance[_employeeAddress] = leaveAmount;
    numOfEmployees++;
  }

  // @dev would be better if we just update mapping employees to false 
  // then when we do getEmployees if wont appear
  function removeEmployee(address _employeeAddress) public employerOnly(_employeeAddress) {
    for (uint i = 0; i < registeredAddresses.length; i++) {
      if (registeredAddresses[i] == _employeeAddress) {
        registeredAddresses[i] = registeredAddresses[registeredAddresses.length-1];
        registeredAddresses.pop();
      }
    }

    for (uint j = 0; j < employerToEmployee[msg.sender].length; j++) {
      if (employerToEmployee[msg.sender][j] == _employeeAddress) {
        employerToEmployee[msg.sender][j] = employerToEmployee[msg.sender][employerToEmployee[msg.sender].length - 1];
        employerToEmployee[msg.sender].pop();
      }
    }

    delete employeeToEmployer[_employeeAddress];
    delete employeeToLeaves[_employeeAddress];
    delete employeeLeaveBalance[_employeeAddress];
  }

  function getEmployeesByEmployer(address _employerAddress) public view returns (address[] memory) {
    return employerToEmployee[_employerAddress];
  }

  // @dev transfer complexity to view function no gas 
  function getAllEmployees() public view returns (address[] memory) {
    address[] memory employeeArray = new address[](numOfEmployees);
    uint counter = 0;
    for (uint i = 0; i < registeredAddresses.length; i++) {
      if (employees[registeredAddresses[i]] == true) {
        employeeArray[counter] = registeredAddresses[i];
        counter++;
      }
    }
    return employeeArray;
  }

  // @dev transfer complexity to view function no gas 
  function getAllEmployers() public view returns (address[] memory) {
    address[] memory employerArray = new address[](numOfEmployers);
    uint counter = 0;
    for (uint i = 0; i < registeredAddresses.length; i++) {
      if (employers[registeredAddresses[i]] == true) {
        employerArray[counter] = registeredAddresses[i];
        counter++;
      }
    }
    return employerArray;
  }

  function applyLeave(string memory date, string memory reason) public {
    leave memory newLeave = leave(
      numLeaves,
      date,
      reason,
      leaveStatus.pending,
      msg.sender
    );

    numLeaves += 1;
    employeeToLeaves[msg.sender].push(newLeave);
    allLeaves.push(newLeave);
    emit LeaveApplied(msg.sender, date);

  }

  function cancelLeave(leave memory leaveToCancel) public validLeaveStatus(leaveToCancel) {
    for (uint i = 0; i < employeeToLeaves[msg.sender].length; i++) {
      if (employeeToLeaves[msg.sender][i].id == leaveToCancel.id) {
        employeeToLeaves[msg.sender][i].status = leaveStatus.cancelled;
      }
    }
    emit LeaveCancelled(msg.sender, leaveToCancel.id);
  }

  function approveLeave(leave memory leaveToApprove) public validLeaveId(leaveToApprove.id) validLeaveStatus(leaveToApprove) employerOnly(leaveToApprove.employee) {
    address employeeAddress = leaveToApprove.employee;
    for (uint i = 0; i < employeeToLeaves[employeeAddress].length; i++) {
      if (employeeToLeaves[employeeAddress][i].id == leaveToApprove.id) {
        employeeToLeaves[employeeAddress][i].status = leaveStatus.approved;

      }
    }

    for (uint j = 0; j < allLeaves.length; j++) {
      if (allLeaves[j].id == leaveToApprove.id) {
        allLeaves[j].status = leaveStatus.approved;
      }
    }

    datesToEmployeesApplied[leaveToApprove.date]++;
    employeeLeaveBalance[employeeAddress]--;
    emit LeaveApproved(employeeAddress, msg.sender, leaveToApprove.id);
  }

  function rejectLeave(leave memory leaveToReject) public validLeaveId(leaveToReject.id) validLeaveStatus(leaveToReject) employerOnly(leaveToReject.employee) {
    address employeeAddress = leaveToReject.employee;
    for (uint i = 0; i < employeeToLeaves[employeeAddress].length; i++) {
      if (employeeToLeaves[employeeAddress][i].id == leaveToReject.id) {
        employeeToLeaves[employeeAddress][i].status = leaveStatus.rejected;

      }
    }

    for (uint j = 0; j < allLeaves.length; j++) {
      if (allLeaves[j].id == leaveToReject.id) {
        allLeaves[j].status = leaveStatus.rejected;
      }
    }
    emit LeaveRejected(employeeAddress, msg.sender, leaveToReject.id);
  }


  function getLeaveBalance() public view returns (uint) {
    return employeeLeaveBalance[msg.sender];
  }

  function getLeaveInformation(uint leaveId) public view returns (leave memory) {
    for (uint i = 0; i < allLeaves.length; i++) {
      if (allLeaves[i].id == leaveId) {
        return allLeaves[i];
      }
    }
  }

  function getLeaveApplications(address employeeAddress) public view returns (leave[] memory) {
    return employeeToLeaves[employeeAddress];
  }

  function setLeaveLimit(address employerAddress, uint limit) public {

    
    emit LeaveLimitSet(employerAddress, limit);
  }





}

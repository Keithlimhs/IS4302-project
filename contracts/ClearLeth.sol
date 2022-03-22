// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ClearLeth {
  address[] employerAddresses;
  address[] employeeAddresses;
  mapping(address => address) employeeToEmployer;
  mapping(address => address[]) employerToEmployee;
  uint public numLeaves = 0;
  uint public leaveAmount;

  enum leaveStatus { pending, cancelled, approved, rejected }
  struct leave {
    uint id;
    string date; //can look into using timestamp
    string reason;
    leaveStatus status;
  }

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

  function addEmployee(address employeeAddress) public {
    employeeAddresses.push(employeeAddress);
    employerToEmployee[msg.sender].push(employeeAddress);
    employeeToEmployer[employeeAddress] = msg.sender;
    employeeLeaveBalance[employeeAddress] = leaveAmount;
  }

  function removeEmployee(address employeeAddress) public {
    for (uint i = 0; i < employeeAddresses.length; i++) {
      if (employeeAddresses[i] == employeeAddress) {
        employeeAddresses[i] = employeeAddresses[employeeAddresses.length-1];
        employeeAddresses.pop();
      }
    }

    for (uint j = 0; j < employerToEmployee[msg.sender].length; j++) {
      if (employerToEmployee[msg.sender][j] == employeeAddress) {
        employerToEmployee[msg.sender][j] = employerToEmployee[msg.sender][employerToEmployee[msg.sender].length - 1];
        employerToEmployee[msg.sender].pop();
      }
    }

    delete employeeToEmployer[employeeAddress];
    delete employeeToLeaves[employeeAddress];
    delete employeeLeaveBalance[employeeAddress];
  }

  function getAllEmployees(address employerAddress) public view returns (address[] memory) {
    return employerToEmployee[employerAddress];
  }

  function getAllEmployers() public view returns (address[] memory) {
    return employerAddresses;
  }

  function applyLeave(string memory date, string memory reason) public {
    leave memory newLeave = leave(
      numLeaves,
      date,
      reason,
      leaveStatus.pending
    );

    numLeaves += 1;
    employeeToLeaves[msg.sender].push(newLeave);
    allLeaves.push(newLeave);
    emit LeaveApplied(msg.sender, date);

  }

  function cancelLeave(leave memory leaveToCancel) public {
    for (uint i = 0; i < employeeToLeaves[msg.sender].length; i++) {
      if (employeeToLeaves[msg.sender][i].id == leaveToCancel.id) {
        employeeToLeaves[msg.sender][i].status = leaveStatus.cancelled;
      }
    }
    emit LeaveCancelled(msg.sender, leaveToCancel.id);
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

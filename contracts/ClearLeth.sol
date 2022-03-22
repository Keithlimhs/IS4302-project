// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ClearLeth {
  //uint storedData;
  address[] employerAddresses;
  address[] employeeAddresses;
  mapping(address => address) employeeToEmployer;
  mapping(address => address[]) employerToEmployee;
  struct leave {
    uint id;
    string[] dates; //can look into using timestamp
    string reason;
    bool isApproved;
    bool isCancelled;
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
  }

}

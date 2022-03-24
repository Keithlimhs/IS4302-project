const _deploy_contracts = require("../migrations/2_deploy_contracts")
const truffleAssert = require("truffle-assertions");
const assert = require("assert");
const ClearLeth = artifacts.require("./ClearLeth.sol");

contract("ClearLeth", (accounts) => {
  let [owner, employer, employee] = accounts;

  before(async() => {
    let initialLeaveAmount = 12
    clearLethInstance = await ClearLeth.deployed(initialLeaveAmount);
  });

  describe("Employer", async() => {
    // Test Case 1: Contract correctly deployed (constructor runs well)
    it("Test Contract Constructor", async() => {
      let employers = await clearLethInstance.getAllEmployers();
      assert.equal(employers[0], owner, "Owner of contract not an employer")
      let leaveAmount = await clearLethInstance.leaveAmount()
      assert.equal(leaveAmount, 12, "Leave amount not initialized correctly")
    })

    // Test Case 2: Add functions
    it("Test Add functions", async() => {
      await clearLethInstance.addEmployer(employer, {from: owner});
      let employers = await clearLethInstance.getAllEmployers();
      assert.equal(employers[1], employer, "Employer not added successfully");

      await clearLethInstance.addEmployee(employee, {from: employer});
      let employees = await clearLethInstance.getAllEmployees();
      assert.equal(employees[0], employee, "Employee not added successfully");
    })
  })
});

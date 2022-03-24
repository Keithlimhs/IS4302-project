const _deploy_contracts = require("../migrations/2_deploy_contracts");
const truffleAssert = require("truffle-assertions");
const assert = require("assert");
const ClearLeth = artifacts.require("./ClearLeth.sol");

contract("ClearLeth", (accounts) => {
    let [owner, employer, employer2, employee, employee2] = accounts;

    before(async () => {
        let initialLeaveAmount = 12;
        clearLethInstance = await ClearLeth.deployed(initialLeaveAmount);
    });

    // Test Case 1: Contract correctly deployed (constructor runs well)
    it("Test Contract Constructor", async () => {
        let employers = await clearLethInstance.getAllEmployers();
        assert.equal(employers[0], owner, "Owner of contract not an employer");
        let leaveAmount = await clearLethInstance.leaveAmount();
        assert.equal(leaveAmount, 12, "Leave amount not initialized correctly");
    });

    // Test Case 2: Add/remove functions
    it("Test Add and Remove functions", async () => {
        await clearLethInstance.addEmployer(employer, { from: owner });
        let employers = await clearLethInstance.getAllEmployers();
        assert.equal(employers[1], employer, "Employer not added successfully");

        await clearLethInstance.addEmployee(employee, { from: employer });
        let employeesAdd = await clearLethInstance.getAllEmployees();
        assert.equal(
            employeesAdd[0],
            employee,
            "Employee not added successfully"
        );

        await clearLethInstance.removeEmployee(employee, { from: employer });
        let employeesRemove = await clearLethInstance.getAllEmployees();
        assert.equal(
            employeesRemove.length,
            0,
            "Employee not removed successfuly"
        );
    });

    // Test Case 2b: Modifers for add/remove functions
    it("Ensure only employers can add or remove employers/employees", async () => {
        await clearLethInstance.addEmployee(employee, { from: employer });
        let employeesAdd = await clearLethInstance.getAllEmployees();
        assert.equal(
            employeesAdd[0],
            employee,
            "Employee not added successfully"
        );

        await truffleAssert.reverts(
            clearLethInstance.addEmployee(employee2, { from: employee }),
            "Only an employer can call this function"
        );

        await truffleAssert.reverts(
            clearLethInstance.addEmployer(employer2, { from: employee }),
            "Only an employer can call this function"
        );

        await clearLethInstance.addEmployer(employer2, { from: owner });
        await truffleAssert.reverts(
            clearLethInstance.removeEmployee(employee, { from: employer2 }),
            "Only employer of this employee can call this function"
        );
    });

    // Test Case 3: Applying/cancelling leaves
    it("Test applying and cancelling of leaves", async () => {
        let leaveApplication = await clearLethInstance.applyLeave(
            "2022-03-05",
            web3.utils.asciiToHex("test"),
            { from: employee }
        );
        truffleAssert.eventEmitted(leaveApplication, "LeaveApplied");

        let leave = await clearLethInstance.getLeaveInformation(0);
        let leaveCancellation = await clearLethInstance.cancelLeave(leave, {
            from: employee,
        });
        truffleAssert.eventEmitted(leaveCancellation, "LeaveCancelled");
    });

    // Test Case 3b: Testing reverts
    it("Ensure only employees can apply leave & cancel leaves", async () => {
        await truffleAssert.reverts(
            clearLethInstance.applyLeave(
                "2022-03-05",
                web3.utils.asciiToHex("test"),
                { from: employer }
            ),
            "Only employees can call this function"
        );

        let leaveApplication = await clearLethInstance.applyLeave(
            "2022-03-05",
            web3.utils.asciiToHex("test"),
            { from: employee }
        );
        truffleAssert.eventEmitted(leaveApplication, "LeaveApplied");

        let leave = await clearLethInstance.getLeaveInformation(1);
        await truffleAssert.reverts(
            clearLethInstance.cancelLeave(leave, {
                from: employer,
            }),
            "Only employee of this leave can call this function"
        );
    });

    // Test Case 4: Approving/rejecting leaves
    it("Test approving and rejecting of leaves", async () => {
        let leave = await clearLethInstance.getLeaveInformation(1);
        let leaveApproval = await clearLethInstance.approveLeave(leave, {
            from: employer,
        });
        truffleAssert.eventEmitted(leaveApproval, "LeaveApproved");

        let leaveApplication2 = await clearLethInstance.applyLeave(
            "2022-04-05",
            web3.utils.asciiToHex("test"),
            { from: employee }
        );
        truffleAssert.eventEmitted(leaveApplication2, "LeaveApplied");

        let leave2 = await clearLethInstance.getLeaveInformation(2);
        let leaveRejection = await clearLethInstance.rejectLeave(leave2, {
            from: employer,
        });
        truffleAssert.eventEmitted(leaveRejection, "LeaveRejected");
    });

    // Test Case 4b: Testing modifiers
    it("Ensure only employers of employee can approve or reject leave", async () => {
        let leaveApplication2 = await clearLethInstance.applyLeave(
            "2022-05-05",
            web3.utils.asciiToHex("test"),
            { from: employee }
        );
        truffleAssert.eventEmitted(leaveApplication2, "LeaveApplied");

        let leave3 = await clearLethInstance.getLeaveInformation(3);
        await truffleAssert.reverts(
            clearLethInstance.approveLeave(leave3, {
                from: employee,
            }),
            "Only employer of this employee can call this function"
        );

        await truffleAssert.reverts(
            clearLethInstance.rejectLeave(leave3, {
                from: employee,
            }),
            "Only employer of this employee can call this function"
        );
    });
});

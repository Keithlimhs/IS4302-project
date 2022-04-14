const moment = require("moment");
const _deploy_contracts = require("../migrations/2_deploy_contracts");
const truffleAssert = require("truffle-assertions");
const assert = require("assert");
const ClearLeth = artifacts.require("./ClearLeth.sol");

contract("ClearLeth", (accounts) => {
    let [
        owner,
        employer,
        employer2,
        employee,
        employee2,
        authority,
        authority2,
    ] = accounts;

    before(async () => {
        let initialLeaveAmount = 12;
        clearLethInstance = await ClearLeth.deployed(initialLeaveAmount);
    });

    // Test Case 1: Contract correctly deployed (constructor runs well)
    it("Test Contract Constructor", async () => {
        let employers = await clearLethInstance.getAllEmployers();
        assert.equal(employers[0], owner, "Owner of contract not an employer");
        let ownerAddress = await clearLethInstance.contractOwner();
        assert.equal(
            ownerAddress,
            owner,
            "Contract deployer not declared as owner"
        );
        let leaveAmount = await clearLethInstance.leaveAmount();
        assert.equal(leaveAmount, 12, "Leave amount not initialized correctly");
    });

    // Test Case 1.1: Test address to user information
    it("Test User Information", async () => {
        let ownerAddress = await clearLethInstance.contractOwner();
        let user = await clearLethInstance.getUser();
        assert.equal(user.name, "Owner", "Name info stored correctly");
        assert.equal(user.wallet, ownerAddress, "Wallet info stored correctly");
        assert.equal(user.company, "NUS", "Company info stored correctly");
    });

    // Test Case 2: Add/remove functions (Employee, Employer, Authority)
    it("Test Add and Remove functions", async () => {
        await clearLethInstance.addEmployer(
            "Company 1",
            "Employer-1",
            employer,
            2,
            {
                from: owner,
            }
        );
        let employers = await clearLethInstance.getAllEmployers();
        assert.equal(employers[1], employer, "Employer not added successfully");

        await clearLethInstance.addEmployee("Employee-1", employee, {
            from: employer,
        });
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

        await clearLethInstance.addAuthority("Authority-1", authority, {
            from: owner,
        });
        let authorityAdd = await clearLethInstance.getAllAuthorities();
        assert.equal(
            authorityAdd[0],
            authority,
            "Authority not added successfully"
        );
    });

    // Test Case 2b: Modifers for add/remove functions
    it("Ensure only employers can add or remove employers/employees", async () => {
        await clearLethInstance.addEmployee("Employee-1", employee, {
            from: employer,
        });
        let employeesAdd = await clearLethInstance.getAllEmployees();
        assert.equal(
            employeesAdd[0],
            employee,
            "Employee not added successfully"
        );

        await truffleAssert.reverts(
            clearLethInstance.addEmployee("Employee-2", employee2, {
                from: employee,
            }),
            "Only an employer can call this function"
        );

        await truffleAssert.reverts(
            clearLethInstance.addEmployer(
                "Company 1",
                "Employer-2",
                employer2,
                2,
                {
                    from: employee,
                }
            ),
            "Only an employer can call this function"
        );

        await clearLethInstance.addEmployer(
            "Company 1",
            "Employer-2",
            employer2,
            2,
            {
                from: owner,
            }
        );
        await truffleAssert.reverts(
            clearLethInstance.removeEmployee(employee, {
                from: employer2,
            }),
            "Only employer of this employee can call this function"
        );

        await truffleAssert.reverts(
            clearLethInstance.addAuthority("Authority-2", authority2, {
                from: employer,
            }),
            "Only the contract owner can call this function"
        );
    });

    // Test Case 3: Applying/cancelling leaves
    it("Test applying and cancelling of leaves", async () => {
        let timestamp = moment("2022-04-05").unix();
        // TO GET LOCAL DATE STRING
        // let unixDate = new Date(today.unix() * 1000);
        // console.log(unixDate.toLocaleString());

        let leaveApplication = await clearLethInstance.applyLeaves(
            [timestamp],
            [web3.utils.asciiToHex("test reason")],
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
        let timestamp = moment("2022-04-05").unix();
        await truffleAssert.reverts(
            clearLethInstance.applyLeaves(
                [timestamp],
                [web3.utils.asciiToHex("test")],
                {
                    from: employer,
                }
            ),
            "Only employees can call this function"
        );

        let leaveApplication1 = await clearLethInstance.applyLeaves(
            [timestamp],
            [web3.utils.asciiToHex("test")],
            { from: employee }
        );
        truffleAssert.eventEmitted(leaveApplication1, "LeaveApplied");

        let leave1 = await clearLethInstance.getLeaveInformation(1);
        await truffleAssert.reverts(
            clearLethInstance.cancelLeave(leave1, {
                from: employer,
            }),
            "Only employee of this leave can call this function"
        );
    });

    // Test Case 4: Approving/rejecting leaves
    it("Test approving and rejecting of leaves", async () => {
        let timestamp = moment("2022-04-05").unix();
        let leave = await clearLethInstance.getLeaveInformation(1);
        let leaveApproval = await clearLethInstance.approveLeave(leave, {
            from: employer,
        });
        truffleAssert.eventEmitted(leaveApproval, "LeaveApproved");

        let leaveApplication2 = await clearLethInstance.applyLeaves(
            [timestamp],
            [web3.utils.asciiToHex("test")],
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
        let timestamp = moment("2022-04-05").unix();
        let leaveApplication3 = await clearLethInstance.applyLeaves(
            [timestamp],
            [web3.utils.asciiToHex("test")],
            { from: employee }
        );
        truffleAssert.eventEmitted(leaveApplication3, "LeaveApplied");

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

    it("Ensure that number of leaves approved cannot exceed Leave Limit", async () => {
        let timestamp = moment("2022-04-05").unix();

        // Approve Leave3
        let leave3 = await clearLethInstance.getLeaveInformation(3);
        let leaveApproval3 = await clearLethInstance.approveLeave(leave3, {
            from: employer,
        });
        truffleAssert.eventEmitted(leaveApproval3, "LeaveApproved");

        // Approve Leave4 should revert because leaveLimit only 2 (leave1, leave3)
        let leaveApplication4 = await clearLethInstance.applyLeaves(
            [timestamp],
            [web3.utils.asciiToHex("test")],
            { from: employee }
        );
        truffleAssert.eventEmitted(leaveApplication4, "LeaveApplied");

        let leave4 = await clearLethInstance.getLeaveInformation(4);
        await truffleAssert.reverts(
            clearLethInstance.approveLeave(leave4, {
                from: employer,
            }),
            "Leave Limit for employer will be exceeded if this leave is approved"
        );
    });

    it("Test setting Leave Limit", async () => {
        let leaveLimitSet = await clearLethInstance.setLeaveLimit(3, {
            from: employer,
        });
        truffleAssert.eventEmitted(leaveLimitSet, "LeaveLimitSet");

        let leave4 = await clearLethInstance.getLeaveInformation(4);

        let leaveApproval4 = await clearLethInstance.approveLeave(leave4, {
            from: employer,
        });
        truffleAssert.eventEmitted(leaveApproval4, "LeaveApproved");
    });
});

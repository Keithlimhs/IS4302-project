const ClearLeth = artifacts.require("./ClearLeth.sol");

contract("ClearLeth", accounts => {
  it("...should store the value 89.", async () => {
    const clearLethInstance = await ClearLeth.deployed();

    // Set value of 89
    await clearLethInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await clearLethInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});

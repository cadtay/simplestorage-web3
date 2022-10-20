const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("SimpleStorage", () => {
    let simpleStorageFactory;
    let simpleStorage;

    beforeEach(async () => {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it("Should start with a favorite number of 0", async () => {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "0";
        assert.equal(currentValue.toString(), expectedValue);
    });

    it("Should update when we call store", async () => {
        const expectedValue = "99";
        const transactionResponse = await simpleStorage.store(expectedValue);
        await transactionResponse.wait(1);
        const value = await simpleStorage.retrieve();
        assert.equal(value.toString(), expectedValue);
    });

    it("Should add person to list", async () => {
        await simpleStorage.addPersonToList(99, "Callum");
        const peopleList = await simpleStorage.people(0);
        assert.equal(peopleList.favoriteNumber, 99);
        assert.equal(peopleList.name, "Callum")
    });

    it("Should add person to mapping", async () => {
        await simpleStorage.addPersonToList(99, "Callum");
        const peopleMapping = await simpleStorage.nameToFavoriteNumber("Callum");
        assert.equal(peopleMapping, "99");
    });
});
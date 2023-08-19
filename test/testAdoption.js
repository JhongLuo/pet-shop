const Adoption = artifacts.require("Adoption");
const assert = require("assert");

contract("Adoption", (accounts) => {
    let adoption;
    const adopter = accounts[0];
  
    beforeEach(async () => {
      adoption = await Adoption.new();
    });
    
    it("should initialize the contract with the correct values", async () => {
        const pet = await adoption.getPet(0);
        assert.equal(pet.name, "Frieda", "First pet's name should be Frieda");
        assert.equal(pet.age.toNumber(), 3, "First pet's age should be 3");
        assert.equal(pet.breed, "Scottish Terrier", "First pet's breed should be Scottish Terrier");
        assert.equal(pet.location, "Lisco, Alabama", "First pet's location should be Lisco, Alabama");
        assert.equal(pet.image, "images/scottish-terrier.jpeg", "First pet's image should be images/scottish-terrier.jpeg");
        assert.equal(pet.adopted, false, "First pet's adopted should be false");
        assert.equal(pet.reward.toNumber(), 0, "First pet's reward should be 0");
        assert.equal(pet.adopters.length, 0, "First pet's adopters length should be 0");
        assert.equal((await adoption.totalPets()).toNumber(), 16, "Total pets should be 16");
    });

    it("should allow a user to adopt a pet", async () => {
        const petId = 0;
        await adoption.adopt(petId, { from: adopter });
        const pet = await adoption.getPet(petId);
        assert.equal(pet.adopted, true, "Pet's adopted status should be true");
        assert.equal(pet.adopters[0], adopter, "Pet's adopter should be the adopter's address");
    });
  
    it("should allow a user to unadopt a pet", async () => {
        await adoption.adopt(0, { from: adopter });
        await adoption.unAdopt(0, { from: adopter, value: web3.utils.toWei("1", "ether") });
        const pet = await adoption.getPet(0);
        assert.equal(pet.adopted, false, "Pet's adopted status should be false");
        assert.equal(pet.adopters.length, 1, "Pet's adopters history length should be 1");
        assert.equal(pet.adopters[0], adopter, "Pet's adopter history should be this address");
    });
    
    it("should add a reward to a pet correctly", async () => {
        const petId = 0;
        const rewardAmount = web3.utils.toWei("1.12", "ether");
        await adoption.addReward(petId, { from: adopter, value: rewardAmount });
        const pet = await adoption.getPet(petId);
        assert.equal(pet[7], rewardAmount, "Reward amount is incorrect");
    });

    it("should add a pet correctly", async () => {
        await adoption.addPet("Sida", 21, "Bichon", "Toronto, Canada", "https://i.imgur.com/XGWHeUc.jpeg", { from: accounts[0], value: web3.utils.toWei("1", "ether") });        
        assert.equal((await adoption.totalPets()).toNumber(), 17, "Total pets should be 17");
        const pet = await adoption.getPet(16);
        assert.equal(pet.name, "Sida", "Pet's name should be Sida");
        assert.equal(pet.age.toNumber(), 21, "Pet's age should be 21");
        assert.equal(pet.breed, "Bichon", "Pet's breed should be Bichon");
        assert.equal(pet.location, "Toronto, Canada", "Pet's location should be Toronto, Canada");
        assert.equal(pet.image, "https://i.imgur.com/XGWHeUc.jpeg", "Pet's image should be https://i.imgur.com/XGWHeUc.jpeg");
        assert.equal(pet.adopted, false, "Pet's adopted status should be false");
        assert.equal(pet.reward.toNumber(), 0, "Pet's reward should be 0");
    });

    it("should get correct breeds correctly when new breed is created", async () => {
        var initialBreeds = await adoption.getAllBreeds();
        initialBreeds = [...new Set(initialBreeds)];
        initialBreeds = initialBreeds.filter(breed => breed !== "");
        assert.equal(initialBreeds.length, 4, "Initial breeds count is incorrect");
        await adoption.addPet("Sida", 21, "Bichon", "Toronto, Canada", "https://i.imgur.com/XGWHeUc.jpeg", { from: accounts[0], value: web3.utils.toWei("1", "ether") });
        var updatedBreeds = await adoption.getAllBreeds();
        updatedBreeds = [...new Set(updatedBreeds)];
        updatedBreeds = updatedBreeds.filter(breed => breed !== "");
        assert.equal(updatedBreeds.length, 5, "Updated breeds count is incorrect");
        assert(updatedBreeds.includes("Bichon"), "Updated breeds does not include Bichon");
    });

    it("should give reward to adopter when pet is adopted", async () => {
        const petId = 0;
        const rewardAmount = web3.utils.toWei("1.12", "ether");
        await adoption.addReward(petId, { from: adopter, value: rewardAmount });
        const initialBalance = await web3.eth.getBalance(adopter);
        const transaction = await adoption.adopt(petId, { from: adopter });
        const gasUsed = transaction.receipt.gasUsed;
        const tx = await web3.eth.getTransaction(transaction.tx);
        const gasPrice = tx.gasPrice;
        const gasCost = web3.utils.toBN(gasUsed).mul(web3.utils.toBN(gasPrice));
        const finalBalance = await web3.eth.getBalance(adopter);
        const expectedBalance = web3.utils.toBN(initialBalance).add(web3.utils.toBN(rewardAmount)).sub(gasCost);
        assert.equal(finalBalance, expectedBalance.toString(), "Final balance is incorrect");
    });

    it("should require the user to pay fine plus reward when returning pet", async () => {
        const petId = 0;
        const rewardAmount = web3.utils.toWei("1.12", "ether");
        const unAdoptFee = web3.utils.toWei("1", "ether");
        await adoption.addReward(petId, { from: accounts[1], value: rewardAmount });
        await adoption.adopt(petId, { from: accounts[1] });
        
        const initialBalance = await web3.eth.getBalance(accounts[1]);
        const transaction = await adoption.unAdopt(petId, { from: accounts[1], value: web3.utils.toBN(unAdoptFee).add(web3.utils.toBN(rewardAmount)) });
        const gasUsed = transaction.receipt.gasUsed;
        const gasPrice = (await web3.eth.getTransaction(transaction.tx)).gasPrice;
        const gasCost = web3.utils.toBN(gasUsed).mul(web3.utils.toBN(gasPrice));
        const finalBalance = await web3.eth.getBalance(accounts[1]);
        const expectedBalance = web3.utils.toBN(initialBalance).sub(web3.utils.toBN(unAdoptFee)).sub(web3.utils.toBN(rewardAmount)).sub(gasCost);
        assert.equal(finalBalance, expectedBalance.toString(), "Final balance is incorrect");
    });
      
    it("should increment servedCount when a pet is adopted or unadopted", async () => {
        const initialServedCount = await adoption.servedCount();
        const petId = 0;
        await adoption.adopt(petId, { from: accounts[1] });
        let newServedCount = await adoption.servedCount();
        assert.equal(newServedCount.toNumber(), initialServedCount.toNumber() + 1, "servedCount did not increment after adoption");
        await adoption.unAdopt(petId, { from: accounts[1], value: web3.utils.toWei("1", "ether") });
        newServedCount = await adoption.servedCount();
        assert.equal(newServedCount.toNumber(), initialServedCount.toNumber() + 2, "servedCount did not increment after unadoption");
    });

    it("should increment and decrement adoptedCount when a pet is adopted or unadopted", async () => {
        const initialAdoptedCount = await adoption.adoptedCount();
        const petId = 0;
        await adoption.adopt(petId, { from: accounts[1] });
        let newAdoptedCount = await adoption.adoptedCount();
        assert.equal(newAdoptedCount.toNumber(), initialAdoptedCount.toNumber() + 1, "adoptedCount did not increment after adoption");
        await adoption.unAdopt(petId, { from: accounts[1], value: web3.utils.toWei("1", "ether") });
        newAdoptedCount = await adoption.adoptedCount();
        assert.equal(newAdoptedCount.toNumber(), initialAdoptedCount.toNumber(), "adoptedCount did not decrement after unadoption");
    });
      
    it("should filter pets by adoption status correctly", async () => {
        const petCount = await adoption.totalPets();
        for (let i = 0; i < petCount; i++) {
            let pet = await adoption.getPet(i);
            const isAdopted = await adoption.checkPetAdoptionStatus(i, true);
            assert.equal(isAdopted, pet[6], `Incorrect adoption status for pet ${i}`);
        }
    });

    it("should filter pets by location correctly", async () => {
        const petCount = await adoption.totalPets();
        for (let i = 0; i < petCount; i++) {
            let pet = await adoption.getPet(i);
            const isMatchingLocation = await adoption.checkPetLocation(i, pet[3]);
            assert.equal(isMatchingLocation, true, 'Incorrect filtering by location for pet ${i}');
        }
    });

    it("should filter pets by breed correctly", async () => {
        const petCount = await adoption.totalPets();
        for (let i = 0; i < petCount; i++) {
            let pet = await adoption.getPet(i);
            const isMatchingBreed = await adoption.checkPetBreed(i, pet[2]);
            assert.equal(isMatchingBreed, true, 'Incorrect filtering by breed for pet ${i}');
        }
    });
    
    it("should filter pets by age correctly", async () => {
        const petCount = await adoption.totalPets();
        for (let i = 0; i < petCount; i++) {
            let pet = await adoption.getPet(i);
            const isMatchingAge = await adoption.checkPetAge(i, pet[1]);
            assert.equal(isMatchingAge, true, 'Incorrect filtering by age for pet ${i}');
        }
    });
});
  
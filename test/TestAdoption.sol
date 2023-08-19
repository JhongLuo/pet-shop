// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
  Adoption adoption = Adoption(DeployedAddresses.Adoption());
  function testInitContract() public {
    Adoption.Pet memory firstPet = adoption.getPet(0);
    Assert.equal(firstPet.name, "Frieda", "First pet's name should be Frieda");
    Assert.equal(firstPet.age, 3, "First pet's age should be 3");
    Assert.equal(firstPet.breed, "Scottish Terrier", "First pet's breed should be Scottish Terrier");
    Assert.equal(firstPet.location, "Lisco, Alabama", "First pet's location should be Lisco, Alabama");
    Assert.equal(firstPet.image, "images/scottish-terrier.jpeg", "First pet's image should be images/scottish-terrier.jpeg");
    Assert.equal(firstPet.adopted, false, "First pet's adopted should be false");
    Assert.equal(firstPet.reward, 0, "First pet's reward should be 0");
    Assert.equal(firstPet.adopters.length, 0, "First pet's adopters length should be 0");
    Assert.equal(adoption.totalPets(), 16, "Total pets should be 16");
  }

  function testAddPet() public {
    uint totalPets = adoption.totalPets();
    uint petId = adoption.addPet("Sida", 21, "Bichon", "Toronto Canada", "Test", {value: 1 ether});
    Assert.equal(petId, totalPets + 1, "PetId should be totalPets + 1");
    Assert.equal(adoption.totalPets(), totalPets + 1, "Total pets should be totalPets + 1");
    Adoption.Pet memory lastPet = adoption.getPet(petId);
    Assert.equal(lastPet.name, "Sida", "Last pet's name should be Sida");
    Assert.equal(lastPet.age, 21, "Last pet's age should be 21");
    Assert.equal(lastPet.breed, "Bichon", "Last pet's breed should be Bichon");
    Assert.equal(lastPet.location, "Toronto Canada", "Last pet's location should be Toronto Canada");
    Assert.equal(lastPet.image, "Test", "Last pet's image should be Test");
    Assert.equal(lastPet.adopted, false, "Last pet's adopted should be false");
    Assert.equal(lastPet.reward, 0, "Last pet's reward should be 0");
    Assert.equal(lastPet.adopters.length, 0, "Last pet's adopters length should be 0");
  }
}



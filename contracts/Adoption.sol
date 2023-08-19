pragma solidity ^0.5.0;

contract Adoption {
  address[16] public adopters;
  uint public servedCount = 0;
  uint public adoptedCount = 0;

  function adopt(uint petId) public returns (uint) {
    require(petId >= 0 && petId <= 15);
    require(adopters[petId] == address(0));
    adopters[petId] = msg.sender;
    servedCount += 1;
    adoptedCount += 1;
    return petId;
  }

  function unAdopt(uint petId) public returns (uint) {
    require(petId >= 0 && petId <= 15, "PetId is not valid");
    require(adopters[petId] != address(0), "Pet is not adopted");
    require(adopters[petId] == msg.sender, "You are not the owner of this pet");
    adopters[petId] = address(0);
    servedCount += 1;
    adoptedCount -= 1;
    return petId;
  }

  function getAdopters() public view returns (address[16] memory) {
    return adopters;
  }

  function getServedCount() public view returns (uint) {
    return servedCount;
  }

  function getAdoptedCount() public view returns (uint) {
    return adoptedCount;
  }
}
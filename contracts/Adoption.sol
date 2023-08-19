// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Adoption {
  
  struct Pet {
    string name;
    uint age;
    string breed;
    string location;
    string image;
    address[] adopters;
    bool adopted;
    uint reward;
  }

  Pet[] public pets;
  address payable public contractOwner;
  uint public servedCount = 0;
  uint public adoptedCount = 0;
  uint public totalPets = 0;
  uint public addPetFee = 1 ether;
  uint public unAdoptFee = 1 ether;
  
  function getAllBreeds() public view returns (string[] memory) {
    string[] memory breeds = new string[](totalPets);
    for (uint i = 0; i < totalPets; i++) {
      breeds[i] = pets[i].breed;
    }
    return breeds;
  }

  function checkPetAdoptionStatus(uint index, bool adopted) public view returns (bool) {
    require(index < totalPets, "PetId is not valid");
    return pets[index].adopted == adopted;
  }

  function checkPetLocation(uint index, string memory location) public view returns (bool) {
    require(index < totalPets, "PetId is not valid");
    return keccak256(abi.encodePacked(pets[index].location)) == keccak256(abi.encodePacked(location));
  }

  function checkPetBreed(uint index, string memory breed) public view returns (bool) {
    require(index < totalPets, "PetId is not valid");
    return keccak256(abi.encodePacked(pets[index].breed)) == keccak256(abi.encodePacked(breed));
  }

  function checkPetAge(uint index, uint age) public view returns (bool) {
    require(index < totalPets, "PetId is not valid");
    return pets[index].age == age;
  }

  function getPet(uint index) public view returns (
    string memory name,
    uint age,
    string memory breed,
    string memory location,
    string memory image,
    address[] memory adopters,
    bool adopted,
    uint reward
  ) {
    require(index < totalPets, "PetId is not valid");
    Pet memory pet = pets[index];
    return (
      pet.name,
      pet.age,
      pet.breed,
      pet.location,
      pet.image,
      pet.adopters,
      pet.adopted,
      pet.reward
    );
  }

  constructor() {
    contractOwner = payable(msg.sender);
    pets.push(Pet("Frieda", 3, "Scottish Terrier", "Lisco, Alabama", "images/scottish-terrier.jpeg", new address[](0), false, 0));
    pets.push(Pet("Gina", 3, "Scottish Terrier", "Tooleville, West Virginia", "images/scottish-terrier.jpeg", new address[](0), false, 0));
    pets.push(Pet("Collins", 2, "French Bulldog", "Freeburn, Idaho", "images/french-bulldog.jpeg", new address[](0), false, 0));
    pets.push(Pet("Melissa", 2, "Boxer", "Camas, Pennsylvania", "images/boxer.jpeg", new address[](0), false, 0));
    pets.push(Pet("Jeanine", 2, "French Bulldog", "Gerber, South Dakota", "images/french-bulldog.jpeg", new address[](0), false, 0));
    pets.push(Pet("Elvia", 3, "French Bulldog", "Innsbrook, Illinois", "images/french-bulldog.jpeg", new address[](0), false, 0));
    pets.push(Pet("Latisha", 3, "Golden Retriever", "Soudan, Louisiana", "images/golden-retriever.jpeg", new address[](0), false, 0));
    pets.push(Pet("Coleman", 3, "Golden Retriever", "Jacksonwald, Palau", "images/golden-retriever.jpeg", new address[](0), false, 0));
    pets.push(Pet("Nichole", 2, "French Bulldog", "Honolulu, Hawaii", "images/french-bulldog.jpeg", new address[](0), false, 0));
    pets.push(Pet("Fran", 3, "Boxer", "Matheny, Utah", "images/boxer.jpeg", new address[](0), false, 0));
    pets.push(Pet("Leonor", 2, "Boxer", "Tyhee, Indiana", "images/boxer.jpeg", new address[](0), false, 0));
    pets.push(Pet("Dean", 3, "Scottish Terrier", "Windsor, Montana", "images/scottish-terrier.jpeg", new address[](0), false, 0));
    pets.push(Pet("Stevenson", 3, "French Bulldog", "Kingstowne, Nevada", "images/french-bulldog.jpeg", new address[](0), false, 0));
    pets.push(Pet("Kristina", 4, "Golden Retriever", "Sultana, Massachusetts", "images/golden-retriever.jpeg", new address[](0), false, 0));
    pets.push(Pet("Ethel", 2, "Golden Retriever", "Broadlands, Oregon", "images/golden-retriever.jpeg", new address[](0), false, 0));
    pets.push(Pet("Terry", 2, "Golden Retriever", "Dawn, Wisconsin", "images/golden-retriever.jpeg", new address[](0), false, 0));
    totalPets = 16;
  }

  function addPet(string memory name, uint age, string memory breed, string memory location, string memory image) public payable returns (uint) {
    require(msg.value == addPetFee);
    contractOwner.transfer(addPetFee);
    pets.push(Pet(name, age, breed, location, image, new address[](0), false, 0));
    totalPets += 1;
    return totalPets;
  }

  function adopt(uint petId) public returns (uint) {
    require(petId < totalPets, "PetId is not valid");
    require(!pets[petId].adopted , "Pet is already adopted");
    // update adoption status
    pets[petId].adopters.push(msg.sender);
    pets[petId].adopted = true;
    // give reward to the pet owner
    if (pets[petId].reward > 0) {
      require(address(this).balance >= pets[petId].reward, "Contract has insufficient funds");
      payable(msg.sender).transfer(pets[petId].reward);
    }
    // update the count
    servedCount += 1;
    adoptedCount += 1;
    return petId;
  }

  function unAdopt(uint petId) public payable returns (uint) {
    require(petId < totalPets, "PetId is not valid");
    require(pets[petId].adopted, "Pet is not adopted");
    require(pets[petId].adopters[pets[petId].adopters.length - 1] == msg.sender, "You are not the owner of this pet");
    // calculate the total unAdoption fee and pay it
    uint totalUnAdoptionFee = unAdoptFee + pets[petId].reward;
    require(msg.value >= totalUnAdoptionFee, "You need to pay the unadopt fee");
    contractOwner.transfer(totalUnAdoptionFee);
    // update adoption status
    pets[petId].adopted = false;
    pets[petId].reward = 0;
    // update the count
    servedCount += 1;
    adoptedCount -= 1;
    
    return petId;
  }

  function addReward(uint petId) public payable returns (uint) {
    require(petId < totalPets, "PetId is not valid");
    require(!pets[petId].adopted, "Pet is already adopted");
    require(msg.value > 0, "You need to pay some reward");
    require(pets[petId].reward + msg.value > pets[petId].reward, "The reward is too big");
    pets[petId].reward += msg.value;
    return petId;
  }
}
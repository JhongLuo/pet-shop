App = {
  web3Provider: null,
  contracts: {},
  accounts : null,
  pets: [],
  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var breedDropdown = $('#breed');
      var breeds = [...new Set(data.map(pet => pet.breed))];
      breeds.forEach(breed => {
        breedDropdown.append($('<option></option>').attr('value', breed).text(breed));
      });
    });  
    this.handleSubmitRewardClick();
    return await App.initWeb3();
  },  

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
      
      // Use our contract to retrieve and mark the adopted pets
      return App.refresh();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-unadopt', App.handleUnAdopt);
  },

  refreshCounts: function() {
    App.contracts.Adoption.deployed().then(function(instance) {
      return instance.adoptedCount();
    }).then(function(adoptedCount) {
      $('#adoptedCount').text('Adopted Pets: ' + adoptedCount);
    }).catch(function(err) {
      console.log(err.message + 'at Adopted Pets');
    });
  
    App.contracts.Adoption.deployed().then(function(instance) {
      return instance.servedCount();
    }).then(function(servedCount) {
      $('#customerCount').text('Served Requests: ' + servedCount);
    }).catch(function(err) {
      console.log(err.message + 'at Served Requests');
    });
  },
  
  renderPets: async function() {
    var petsRow = $('#petsRow');
    var petTemplate = $('#petTemplate');
    petsRow.empty();
    for (let i = 0; i < App.pets.length; i++) {
        let pet = App.pets[i];
        petTemplate.find('.panel-title').text(pet.name);
        petTemplate.find('.pet-age').text(pet.age);
        petTemplate.find('.pet-breed').text(pet.breed);
        petTemplate.find('.pet-location').text(pet.location);
        petTemplate.find('.pet-reward').text(pet.reward); 
        let adoptersList = pet.adopters;
        let [current, previous] = App.splitAdopters(adoptersList, pet.adopted);
        if (current !== null) {
          petTemplate.find('.current-adopter').text(`Current Adopter:\n${current}`);
        } else {
          petTemplate.find('.current-adopter').text('');
        }
        if (previous !== null && previous.length > 0) {
          petTemplate.find('.previous-adopters').text(`Previous Adopters:\n${previous.join(',\n')}`);
        } else{
          petTemplate.find('.previous-adopters').text('');
        }
        if (adoptersList.length === 0) {
          petTemplate.find('.previous-adopters').text('No Adopters History');
        } else {
          petTemplate.find('.previous-adopters').text('');
        }
        petTemplate.find('img').attr('src', pet.image);

        if (pet.adopted === true) {
          if (pet.adopters[pet.adopters.length - 1] === App.accounts[0]) {
            petTemplate.find('button.btn-adopt').text('Unadopt').removeClass('btn-adopt').addClass('btn-unadopt').attr('disabled', false);
            petTemplate.find('.reward-details').hide();
          } else {
            petTemplate.find('button.btn-adopt').text('Already Adopted By Others').attr('disabled', true);
          }
          petTemplate.find('button.btn-add-reward').hide(); // Hide the "Add Reward" button if the pet is adopted
        } else {
          petTemplate.find('.reward-details').show();
          petTemplate.find('button.btn-adopt').text('Adopt').removeClass('btn-unadopt').addClass('btn-adopt').attr('disabled', false);
        }
        
        petTemplate.find('button').attr('data-id', i);
        petsRow.append(petTemplate.html());
    }
    console.log('Pets rendered')
  },
  
  splitAdopters: function(adoptersList, isAdopted) {
    if (adoptersList.length === 0) {return [null, []];}
    adoptersList.reverse();
    if (isAdopted) {
      let current = adoptersList[0];
      let previous = adoptersList.slice(1, adoptersList.length);
      return [current, previous];
    }
    return [null, adoptersList];
  },

  // Function to handle clicking the "Submit Reward" button
  handleSubmitRewardClick: function() {
    $(document).on('click', '.btn-submit-reward', function() {
      let rewardAmount = $(this).siblings('.reward-amount').val();
      $(this).siblings('.reward-amount').val(null);
      let petId = parseInt($(this).data('id'));
      console.log(rewardAmount);
      console.log(petId);

    });
  },
  
  getPets: async function() {
    instance = await App.contracts.Adoption.deployed()
    var totalPets = await instance.totalPets();
    for (let i = 0; i < totalPets; i++) {
      let pet = await instance.getPet(i);
      App.pets.push({
        id: i,
        name: pet[0],
        age: parseInt(pet[1]),
        breed: pet[2],
        location: pet[3],
        image: pet[4],
        adopters: pet[5],
        adopted: pet[6],
        reward: parseInt(pet[7])
      });
    }
    console.log(App.pets)
  },

  getAccounts: async function() {
    await web3.eth.getAccounts(
      function(error, accounts) {
        if (error) {
          console.log(error);
        }
        App.accounts = accounts;
      }
    );
  },


  refresh: async function() {
    await App.getAccounts();
    await App.getPets();
    App.renderPets();
    App.refreshCounts();
  },

  handleAdopt: function(event) {
    event.preventDefault();
    var petId = parseInt($(event.target).data('id'));
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      // Execute adopt as a transaction by sending account
      return adoptionInstance.adopt(petId, {from: App.accounts[0]});
    }).then(function(result) {
      return App.refresh();
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleUnAdopt: function(event) {
    event.preventDefault();
    var petId = parseInt($(event.target).data('id'));
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      return adoptionInstance.unAdopt(petId, {from: App.accounts[0], value: web3.toWei(1 + App.pets[petId].reward, 'ether')});
    }).then(function(result) {
      return App.refresh();
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  filterPets: function(data) {
    var breed = $('#breed').val();
    var age = $('#age').val();
    var location = $('#location').val().toLowerCase();
    var adopted = $('#adopted').prop('checked');
    
    var isPetAdopted = $(`.panel-pet[data-id="${pet.id}"]`).hasClass('btn-unadopt');
    
    var filteredData = data.filter(pet =>
      (!breed || pet.breed === breed) &&
      (!age || pet.age == age) &&
      (!location || pet.location.toLowerCase().includes(location)) &&
      (!adopted || isPetAdopted === adopted)
    );
    
    return filteredData;
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

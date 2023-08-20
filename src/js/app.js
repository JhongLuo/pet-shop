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
  
      App.renderPets(data);
    });
  
    $('#breed, #age, #location, #adopted').change(function() {
      $.getJSON('../pets.json', function(data) {
        var filteredData = App.filterPets(data);
        App.renderPets(filteredData);
      });
    });

    // constants for invalid dates
    
    
    
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

  validTime: function () {
    const invalidDays = [8.20]; // Adjust as needed
    
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.toLocaleTimeString();
    
    const isValidTimeRange = currentHour >= 9 && currentHour <= 17;
    const isValidDay = !invalidDays.includes(currentDay);
    const isWeekday = !(currentDay === 0 || currentDay === 6);

    const isValid = isValidTimeRange && isValidDay && isWeekday;
    
    return isValid;
  },


  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-unadopt', App.handleUnAdopt);
    $(document).on('click', '.btn-register', App.handleRegister);
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
        petTemplate.find('img').attr('src', pet.image);
        if (pet.adopted === true) {
          if (pet.adopters[pet.adopters.length - 1] === App.accounts[0]) {
            petTemplate.find('button').text('Unadopt').removeClass('btn-adopt').addClass('btn-unadopt').attr('disabled', false);
          } else {
            petTemplate.find('button').text('Already Adopted').attr('disabled', true);
          }
        } else {
          petTemplate.find('button').text('Adopt').removeClass('btn-unadopt').addClass('btn-adopt').attr('disabled', false);
        }
        petTemplate.find('button').attr('data-id', i);
        petsRow.append(petTemplate.html());
    }
    console.log('Pets rendered')
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

  handleRegister: function(event) {
    event.preventDefault();
    time_limit = false;

    if (time_limit && !App.validTime()) {
      alert("Transaction disabled at current time")
      return
    }

    var pet = {
      "name": $("#reg-name").val(),
      "imgurl": $("#reg-imgurl").val(),
      "age": parseInt($("#reg-age").val()),
      "breed": $("#reg-breed").val(),
      "location": $("#reg-location").val(),
    }

    console.log("pet register catched: ", pet)
    var adoptionInstance;

    web3.eth.getAccounts(function(err, accounts) {
      if (err) {
        console.log(err.message);
      }
      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.addPet(pet.name, pet.age, pet.breed, pet.location, pet.imgurl, {from: account})
      }).then(function(result){
        location.reload();
      }).catch(function (err){
        console.log(err.message);
      });
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

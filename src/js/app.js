App = {
  web3Provider: null,
  contracts: {},

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
      return instance.getAdoptedCount.call();
    }).then(function(adoptedCount) {
      $('#adoptedCount').text('Adopted Pets: ' + adoptedCount);
    }).catch(function(err) {
      console.log(err.message + 'at Adopted Pets');
    });
  
    App.contracts.Adoption.deployed().then(function(instance) {
      return instance.getServedCount.call();
    }).then(function(servedCount) {
      $('#customerCount').text('Served Requests: ' + servedCount);
    }).catch(function(err) {
      console.log(err.message + 'at Served Requests');
    });
  },
  
  refresh: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters, account) {
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        var account = accounts[0];
        for (i = 0; i < adopters.length; i++) {
          console.log(adopters[i], account)
          if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
            if (adopters[i] === account) {
              $('.panel-pet').eq(i).find('button').text('Unadopt').removeClass('btn-adopt').addClass('btn-unadopt').attr('disabled', false);
            } else {
              $('.panel-pet').eq(i).find('button').text('Already Adopted').attr('disabled', true);
            }
          } else {
            $('.panel-pet').eq(i).find('button').text('Adopt').removeClass('btn-unadopt').addClass('btn-adopt').attr('disabled', false);
          }
        }
      });
    }).catch(function(err) {
      console.log(err.message);
    });
    App.refreshCounts();
  },

  handleAdopt: function(event) {
    event.preventDefault();
    var petId = parseInt($(event.target).data('id'));
    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
    
        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.refresh();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleUnAdopt: function(event) {
    event.preventDefault();
    var petId = parseInt($(event.target).data('id'));
    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
    
        // Execute adopt as a transaction by sending account
        return adoptionInstance.unAdopt(petId, {from: account, value: web3.toWei(1, 'ether')});
      }).then(function(result) {
        return App.refresh();
      }).catch(function(err) {
        console.log(err.message);
      });
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
  
  renderPets: function(data) {
    var petsRow = $('#petsRow');
    var petTemplate = $('#petTemplate');
    petsRow.empty();
  
    for (i = 0; i < data.length; i++) {
      petTemplate.find('.panel-title').text(data[i].name);
      petTemplate.find('img').attr('src', data[i].picture);
      petTemplate.find('.pet-breed').text(data[i].breed);
      petTemplate.find('.pet-age').text(data[i].age);
      petTemplate.find('.pet-location').text(data[i].location);
      petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
  
      petsRow.append(petTemplate.html());
    }
  },
  

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});


App = {
  web3: null,
  contract: null,

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Check if web3 is available
    if (window.ethereum) {
        if (typeof window.ethereum !== 'undefined') {
          // Use the browser injected Ethereum provider
          App.web3 = new Web3(window.ethereum);
          // Request access to the user's MetaMask account
          window.ethereum.enable();
          // Get the user's accounts
          App.web3.eth.getAccounts().then(function (accounts) {
              // Show the first account
              console.log('Connected with MetaMask account: ' + accounts[0]);
          });
      }
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Adoption.json", function(data) {
      const contractABI = data.abi;
      console.log(data.networks)
      const contractAddress = data.networks['5777'].address;
      App.contract = new App.web3.eth.Contract(contractABI, contractAddress);
      App.contract.setProvider(App.web3.currentProvider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-unadopt', App.handleUnAdopt);
  },

  refreshCounts: function() {
    App.contract.methods.getAdoptedCount.call()
    .then(
      function(adoptedCount) {
        $('#adoptedCount').text('Adopted Pets: ' + adoptedCount);
    }).catch(function(err) {
      console.log(err.message + 'at Adopted Pets');
    });
  
    App.contract.methods.getServedCount.call()
    .then(
      function(servedCount) {
        $('#customerCount').text('Served Requests: ' + servedCount);
    }).catch(function(err) {
      console.log(err.message + 'at Served Requests');
    });
  },
  

  refresh: function() {
    App.contract.methods.getAdopters.call()
    .then(function(adopters, account) {
      App.web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        var account = accounts[0];
        for (i = 0; i < adopters.length; i++) {
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
    App.web3.eth.getAccounts().then(function(accounts) {
      App.contract.methods.adopt(petId).send({ from: accounts[0] })
      .then(function(result) {
        console.log('Pet has been adopted, Transaction Result:', result);
      })
      .catch(function(error) {
        console.error('Error in adopting pet:', error);
      });
    });

    return App.refresh();
  },

  handleUnAdopt: function(event) {
    event.preventDefault();
    var petId = parseInt($(event.target).data('id'));
    App.web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contract.methods.unAdopt(petId, { from: account, value: App.web3.utils.toWei('1', 'ether')  }).then(function(result) {
        return App.refresh();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

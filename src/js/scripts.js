//IIFE- prevents assessing of variables globally
var pokeRepository = (function() {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';
  var $modalContainer = $('#modal-container');
  
  //MODAL control
  //show and specify content for modal
  function showModal(item) {
    var $modalTitle = $('.modal-title');
    var $modalBody = $('.modal-body');
    
    $modalTitle.empty();
    $modalBody.empty();

    //pokemon name
    var $nameElement = $('<h3>' + item.name.charAt(0).toUpperCase() + item.name.slice(1) + '</h3>');

    //pokemon image
    var $imageElement = $('<img class="modal-img">');
    $imageElement.attr('src', item.imageUrl);

    //pokemon height
    var $heightElement = $('<p>Height: ' + item.height + 'm</p>');
  
    //pokemon type
    var $typeElement = $('<p>Type(s): ' + item.types + '</p>');

    $modalTitle.append($nameElement);
    $modalBody.append($imageElement, $heightElement, $typeElement);    
  }

  //Add new pokemon and corresponding button
  function addListItem(pokemon) {
    var $pokemonList = $('.pokemon-list');
    var $button = $('<button type="button" id="pokemon-button" class="btn btn-secondary" data-toggle="modal" data-target="#poke-modal">' + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + '</button>');
    
    $pokemonList.append($button);

    buttonClick($button, pokemon);
  }

  //Event listener for button click
  function buttonClick (button, pokemon) {
    button.click(() => {
        showDetails(pokemon);
      });
    }

  //Fetch data from API and add(pokemon) to repository (asynch)
  function loadList() {
    return $.ajax(apiUrl).then(function(json) {
      json.results.forEach(function(item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function(e) {
      console.error(e);
    })
  }

  //Load detailed data for a given Pokemon (asynch)
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url).then(function(details) {
      //add details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = [];
      for (var i = 0; i < details.types.length; i++){
        item.types.push(details.types[i].type.name);
      }
    }).catch(function(e) {
      console.error(e);
    })
  }

  //Show pokemon details
  function showDetails(pokemon) { 
    pokeRepository.loadDetails(pokemon).then(function() {
      showModal(pokemon);
    });
  }

  //Add a pokemon to repository
  function add(pokemon) {
    //add conditional for format --- VALIDATING KEYS 
    // (REVIEW AGAIN)
    if (typeof pokemon === 'object') {
      repository.push(pokemon);
    }
  }
  
  //Return all pokemon objects in array 
  function getAll() {
    return repository;
  }

  //Function objects available outside IIFE
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal,
  };
})();

//Load data for each item
pokeRepository.loadList().then(function() {
  //Data now loaded
  pokeRepository.getAll().forEach(function(pokemon) {
    pokeRepository.addListItem(pokemon);
  });
})
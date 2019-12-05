//IIFE- prevents assessing of variables globally
var pokeRepository = (function() {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';
  var $modalContainer = $('#modal-container');
  
  //MODAL control
  //show and specify content for modal
  function showModal(item) {
    $modalContainer.empty();
    
    var $modal = $('<div class="modal"></div>');

    //close button to hide modal
    var $closeButtonElement = $('<button class="modal-close"></button');
    $closeButtonElement.text(' X ');
    $closeButtonElement.on('click', hideModal); 

    //pokemon name
    var $nameElement = $('<h1>' + item.name.charAt(0).toUpperCase() + item.name.slice(1) + '</p>');

    //pokemon image
    var $imageElement = $('<img class="modal-img"></img>');
    $imageElement.attr('src', item.imageUrl);

    //pokemon height
    var $heightElement = $('<p>Height: ' + item.height + 'm</p>');
  
    //pokemon type
    var $typeElement = $('<p>Type(s): ' + item.types + '</p>');

    $modal.append($closeButtonElement);
    $modal.append($nameElement);
    $modal.append($imageElement);
    $modal.append($heightElement);
    $modal.append($typeElement);
    
    $modalContainer.append($modal).addClass('is-visible');
  }

  //Function to hide modal 
  function hideModal(){
    $modalContainer.removeClass('is-visible');
  }
    
  //close modal with ESC-key
  window.addEventListener('keydown', (e) =>{
    if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')){
      hideModal();
    }
  });

  //close modal when user clicks outside the modal
  $(window).click((e) =>{
    if ($(e.target).is($modalContainer)) {
      hideModal();
    }
  });

  //Add new pokemon and corresponding button
  function addListItem(pokemon) {
    var $pokemonList = $('.pokemon-list');
    var $listItem = $('<li>');
    var $button = $('<button class="pokemon-button">' + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + '</button>');
    
    $listItem.append($button);
    $pokemonList.append($listItem);

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
        // console.log(pokemon);
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
      // console.log(pokemon);
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
    hideModal: hideModal
  };
})();

//Load data for each item
pokeRepository.loadList().then(function() {
  //Data now loaded
  pokeRepository.getAll().forEach(function(pokemon) {
    pokeRepository.addListItem(pokemon);
  });
})
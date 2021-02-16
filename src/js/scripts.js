//IIFE- prevents assessing of variables globally
const pokeRepository = (() => {
  const repository = [];
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

  //MODAL CONTROL
  //show and specify content for modal
  showModal = (item) => {
    const $modalTitle = $('.modal-title');
    const $modalBody = $('.modal-body');

    $modalTitle.empty();
    $modalBody.empty();

    //pokemon name
    const $nameElement = $('<h3>' + item.name.charAt(0).toUpperCase() + item.name.slice(1) + '</h3>');

    //pokemon image-front
    const $imageElement = $('<img class="modal-img">');
    $imageElement.attr('src', item.imageUrl);

    //pokemon image-back
    const $imageElementBack = $('<img class="modal-img">');
    $imageElementBack.attr('src', item.imageUrlBack);

    //pokemon height
    const $heightElement = $('<p>Height: ' + item.height + 'm</p>');

    //pokemon type
    const $typeElement = $('<p>Type(s): ' + item.types + '</p>');

    //pokemon ability
    const $abilityElement = $('<p>Ability(s): ' + item.abilities + '</p>');

    $modalTitle.append($nameElement);
    $modalBody.append($imageElement, $imageElementBack, $heightElement, $typeElement, $abilityElement);
  }


  //Add new pokemon and corresponding button
  addListItem = (pokemon) =>   {
    const $pokemonList = $('.pokemon-list');
    const $button = $('<button type="button" id="pokemon-button" class="btn btn-secondary" data-toggle="modal" data-target="#poke-modal">' + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + '</button>');

    $pokemonList.append($button);
    buttonClick($button, pokemon);
  }


  //Event listener for button click
  buttonClick = (button, pokemon) => {
    button.click(() => {
        showDetails(pokemon);
      });
    }


  //Fetch data from API and add(pokemon) to repository (async)
  loadList = () => {
    return $.ajax(apiUrl).then((json) => {
      json.results.forEach((item) => {
        const pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch((e) => {
      console.error(e);
    })
  }


  //Load detailed data for a given Pokemon (asynch)
  loadDetails = (item) => {
    const url = item.detailsUrl;

    return $.ajax(url).then((details) => {
      //add details to the item
      item.imageUrl = details.sprites.front_default;
      item.imageUrlBack = details.sprites.back_default;
      item.height = details.height;
      item.types = [];
      for (let i = 0; i < details.types.length; i++){
        item.types.push(details.types[i].type.name);
      }
      item.abilities = [];
      for (let i = 0; i < details.abilities.length; i++){
        item.abilities.push(details.abilities[i].ability.name);
      }
    }).catch((e) => {
      console.error(e);
    })
  }


  //Show pokemon details
  showDetails = (pokemon) => {
    pokeRepository.loadDetails(pokemon).then(() => {
      showModal(pokemon);
    });
  }


  //Add a pokemon to repository
  add = (pokemon) => {
    //add conditional for format --- VALIDATING KEYS
    // (REVIEW AGAIN)
    if (typeof pokemon === 'object') {
      repository.push(pokemon);
    }
  }


  //Return all pokemon objects in array
  getAll = () => {
    return repository;
  }


  //Function objects available outside IIFE
  return {
    add,
    getAll,
    addListItem,
    loadList,
    loadDetails,
    showDetails,
    showModal,
  };
})();


//Load data for each item
pokeRepository.loadList().then(() => {
  pokeRepository.getAll().forEach((pokemon) => {
    pokeRepository.addListItem(pokemon);
    pokeRepository.loadDetails(pokemon);
  });
})

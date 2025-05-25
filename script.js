let pokemons = [];
let pokemonData = [];
let BASE_URL = "https://pokeapi.co/api/v2/pokemon?"
let limit = 25;
let offset = 0;


async function init() {
    await fetchPokemons();
    await fetchPokemonData();
    renderPokemons();
}

async function fetchPokemons() {
    let response = await fetch(`${BASE_URL}limit=${limit}&offset=${offset}`);
    let responseToJson = await response.json();
    
    for (let i = 0; i < responseToJson.results.length; i++) {
        pokemons.push({
            name: responseToJson.results[i].name,
            url: responseToJson.results[i].url
        });
    }
    console.log(pokemons);
}

async function fetchPokemonData() {
    for (const pokemon of pokemons){
        let response = await fetch(pokemon.url);
        let responseToJson = await response.json();
        pokemonData.push(responseToJson);
    }
    console.log(pokemonData);
}

function renderPokemons(){
    let pokeCardsContainer = document.getElementById("poke-cards-container");
    pokeCardsContainer.innerHTML = '';
    for (let i = 0; i < pokemons.length; i++){
        pokeCardsContainer.innerHTML += pokeCardTemplate(pokemons[i], pokemonData[i], i);
    }
}

 async function loadMorePokemons(){
    limit += 25;
    offset += 25;
    await fetchPokemons();
    await fetchPokemonData();
    renderPokemons();
}

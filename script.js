let pokemons = [];
let pokemonData = [];
let BASE_URL = "https://pokeapi.co/api/v2/pokemon?"
let limit = 25;
let offset = 0;


async function init() {
    await fetchPokemons();
    await fetchPokemonData();
    console.log(pokemons);
    console.log(pokemonData);
}

async function fetchPokemons(limit = 25, offset = 0) {
    let response = await fetch(`${BASE_URL}limit=${limit}&offset=${offset}`);
    let responseToJson = await response.json();
    
    pokemons = []; // Array leeren
    
    for (let i = 0; i < responseToJson.results.length; i++) {
        pokemons.push({
            name: responseToJson.results[i].name,
            url: responseToJson.results[i].url
        });
    }
}

async function fetchPokemonData() {
    for (const pokemon of pokemons){
        let response = await fetch(pokemon.url);
        let responseToJson = await response.json();
        pokemonData.push(responseToJson);
    }
}


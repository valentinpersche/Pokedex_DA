let pokemons = [];
let pokemonData = [];
let pokemonEvoChain = [];
let BASE_URL = "https://pokeapi.co/api/v2/pokemon?";
let limit = 25;
let offset = 0;

async function init() {
  showSpinner();
  await fetchPokemons();
  await fetchPokemonData();
  await getPokemonEvoChain();
  renderPokemons();
  hideSpinner();
}

async function fetchPokemons() {
  let response = await fetch(`${BASE_URL}limit=${limit}&offset=${offset}`);
  let responseToJson = await response.json();
  pokemons = [];
  for (let i = 0; i < responseToJson.results.length; i++) {
    pokemons.push({
      name: responseToJson.results[i].name,
      url: responseToJson.results[i].url,
    });
  }
}

async function fetchPokemonData() {
  pokemonData = [];
  for (const pokemon of pokemons) {
    let response = await fetch(pokemon.url);
    let responseToJson = await response.json();
    pokemonData.push(responseToJson);
  }
}

async function getPokemonEvoChain() {
  pokemonEvoChain = [];
  for (const pokemon of pokemonData) {
    const evolutionData = await getEvolutionData(pokemon);
    pokemonEvoChain.push({
      name: pokemon.name,
      evoChain: evolutionData,
    });
  }
}

async function getShowdownImgUrlForPokemon(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await response.json();
  return data.sprites.other.showdown.front_default;
}

async function createEvolutionChainData(chain) {
  const evolutionChain = [];
  let current = chain;
  while (current) {
    const name = current.species.name;
    const img = await getShowdownImgUrlForPokemon(name);
    evolutionChain.push({ name, img });
    current = current.evolves_to[0];
  }
  return evolutionChain;
}

async function getEvolutionData(pokemon) {
  const speciesData = await fetchSpeciesData(pokemon.species.url);
  const evolutionData = await fetchEvolutionChain(
    speciesData.evolution_chain.url
  );
  return await createEvolutionChainData(evolutionData.chain);
}

async function fetchSpeciesData(url) {
  const response = await fetch(url);
  return await response.json();
}

async function fetchEvolutionChain(url) {
  const response = await fetch(url);
  return await response.json();
}

function renderPokemons(filter = "") {
  let pokeCardsContainer = document.getElementById("poke-cards-container");
  pokeCardsContainer.innerHTML = "";
  for (let i = 0; i < pokemons.length; i++) {
    if (pokemons[i].name.toLowerCase().includes(filter.toLowerCase())) {
      pokeCardsContainer.innerHTML += pokeCardTemplate(
        pokemons[i],
        pokemonData[i],
        i
      );
    }
  }
}

function showPokemonDetails(index) {
  let pokeDetailsContainer = document.getElementById("poke-details-container");
  pokeDetailsContainer.innerHTML = showPokemonDetailsTemplate(
    pokemons[index],
    pokemonData[index],
    index,
    pokemonData
  );
  pokeDetailsContainer.style.display = "flex";
}

function showStats() {
  document.getElementById('stats-section').style.display = '';
  document.getElementById('moves-section').style.display = 'none';
  document.getElementById('stats-btn').classList.add('active');
  document.getElementById('moves-btn').classList.remove('active');
}
function showMoves() {
  document.getElementById('stats-section').style.display = 'none';
  document.getElementById('moves-section').style.display = '';
  document.getElementById('stats-btn').classList.remove('active');
  document.getElementById('moves-btn').classList.add('active');
}

function closeDetailsCard() {
  document.getElementById("poke-details-container").style.display = "none";
}

function showSpinner() {
  document.getElementById('spinner-overlay').style.display = 'flex';
}
function hideSpinner() {
  document.getElementById('spinner-overlay').style.display = 'none';
}

async function loadMorePokemons() {
  showSpinner();
  limit += 25;
  await fetchPokemons();
  await fetchPokemonData();
  await getPokemonEvoChain();
  renderPokemons();
  hideSpinner();
}

// Event Listener für die Suche
window.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderPokemons(e.target.value);
    });
  }
});



let pokemons = [];
let pokemonData = [];
let pokemonEvoChain = [];
let BASE_URL = "https://pokeapi.co/api/v2/pokemon?";
let limit = 25;
let offset = 0;

async function init() {
  setSpinner(true);
  await fetchPokemons();
  await fetchPokemonData();
  renderPokemons();
  setSpinner(false);
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
  let foundPokemon = false;
  
  for (let i = 0; i < pokemons.length; i++) {
    if (pokemons[i].name.toLowerCase().includes(filter.toLowerCase())) {
      pokeCardsContainer.innerHTML += pokeCardTemplate(
        pokemons[i],
        pokemonData[i],
        i
      );
      foundPokemon = true;
    }
  }
  
  if (!foundPokemon && filter !== "") {
    pokeCardsContainer.innerHTML = noResultsTemplate();
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
  
  const evoChainContainer = document.querySelector('.evo-chain');
  if (evoChainContainer) {
    evoChainContainer.innerHTML = `<div class="mini-spinner-container"><img src='./assets/img/pokeball.png' class='mini-spinner' alt='Lade Evolution'></div>`;
  }
  
  loadAndRenderEvoChain(index);
}

async function loadAndRenderEvoChain(index) {
  const evoChain = await getEvolutionData(pokemonData[index]);
  const evoChainContainer = document.querySelector('.evo-chain');
  if (evoChainContainer) {
    evoChainContainer.innerHTML = evoChain.map((evo, i) => `
      <div class="evo-pokemon">
        <img src="${evo.img}" alt="${evo.name}">
        <span>${evo.name}</span>
      </div>
      ${i < evoChain.length - 1 ? '<div class="evo-arrow">→</div>' : ''}
    `).join('');
  }
}

function toggleDetailsSection(section) {
  const statsSection = document.getElementById('stats-section');
  const movesSection = document.getElementById('moves-section');
  const statsBtn = document.getElementById('stats-btn');
  const movesBtn = document.getElementById('moves-btn');
  if (section === 'stats') {
    statsSection.style.display = '';
    movesSection.style.display = 'none';
    statsBtn.classList.add('active');
    movesBtn.classList.remove('active');
  } else if (section === 'moves') {
    statsSection.style.display = 'none';
    movesSection.style.display = '';
    statsBtn.classList.remove('active');
    movesBtn.classList.add('active');
  }
}

function setSpinner(visible) {
  const footer = document.getElementById('footer-container');
  const spinner = document.getElementById('spinner-overlay');
  if (visible) {
    if (footer) footer.style.display = 'none';
    if (spinner) spinner.style.display = 'flex';
  } else {
    if (footer) footer.style.display = 'flex';
    if (spinner) spinner.style.display = 'none';
  }
}

function closeDetailsCard() {
  document.getElementById("poke-details-container").style.display = "none";
}

async function loadMorePokemons() {
  setSpinner(true);
  limit += 25;
  await fetchPokemons();
  await fetchPokemonData();
  renderPokemons();
  setSpinner(false);
}

window.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-input');
  const loadButton = document.getElementById('load-button');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderPokemons(e.target.value);
      if (e.target.value.trim() === "") {
        loadButton.style.display = '';
      } else {
        loadButton.style.display = 'none';
      }
    });
  }
});



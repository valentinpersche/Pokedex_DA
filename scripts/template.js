function pokeCardTemplate(pokemon, pokemonData, index){
    return `
        <div class="poke-card" onclick="showPokemonDetails(${index})">
            <h4>#${index+1}</h2>
            <h3>${pokemon.name.toUpperCase()}</h3>
            <img src="${pokemonData.sprites.other.showdown.front_default}" alt="${pokemon.name}">
            <div class="types">${pokemonData.types.map(type => `<span class="${type.type.name}-type-color">${type.type.name}</span>`).join('')}</div>
        </div>
    `;
}

function showPokemonDetailsTemplate(pokemon, pokemonData, index) {
  const evoChain = pokemonEvoChain[index].evoChain;
  return `
    <div class="poke-details-card">
      <div class="close-btn-container">
        <button class="close-btn" onclick="closeDetailsCard()">×</button>
      </div>
      <hr>
      <h4>#${index+1}</h4>
      <h3>${pokemon.name.toUpperCase()}</h3>
      <div class="pokemon-nav-container">
        ${index > 0 ? `<button class="nav-btn prev-btn" onclick="showPokemonDetails(${index - 1})">←</button>` : '<div class="nav-btn-placeholder"></div>'}
        <img class="poke-details-img" src="${pokemonData.sprites.other.showdown.front_default}" alt="${pokemon.name}">
        ${index < pokemons.length - 1 ? `<button class="nav-btn next-btn" onclick="showPokemonDetails(${index + 1})">→</button>` : '<div class="nav-btn-placeholder"></div>'}
      </div>
      <div class="types">
        ${pokemonData.types.map(type => `<span class="${type.type.name}-type-color">${type.type.name}</span>`).join('')}
      </div>
      <hr>
      <div class="evo-chain-container">
        <h4>Evolution-Chain</h4>
        <div class="evo-chain">
          ${evoChain.map((evo, i) => `
            <div class="evo-pokemon">
              <img src="${evo.img}" alt="${evo.name}">
              <span>${evo.name}</span>
            </div>
            ${i < evoChain.length - 1 ? '<div class="evo-arrow">→</div>' : ''}
          `).join('')}
        </div>
      </div>
      <hr>
      <div class="toggle-btns">
        <button class="toggle-btn active" id="stats-btn" onclick="showStats()">Stats</button>
        <button class="toggle-btn" id="moves-btn" onclick="showMoves()">Moves</button>
      </div>
      <div id="stats-section">
        <div class="stats-container">
          <div class="stats">
            ${pokemonData.stats.map(stat => `
              <div class="stat-row">
                <span class="stat-label">${stat.stat.name}:</span>
                <div class="stat-bar-bg">
                  <div class="stat-bar" style="width: ${(stat.base_stat / 155) * 120}px"></div>
                </div>
                <span class="stat-value">${stat.base_stat}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div id="moves-section" style="display:none;">
        <div class="moves-container">
          <ul class="moves-list">
            ${pokemonData.moves.map(move => `<li>${move.move.name}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}




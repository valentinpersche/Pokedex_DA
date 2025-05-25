function pokeCardTemplate(pokemon, pokemonData, index){
    return `
        <div class="poke-card">
            <h4>#${index+1}</h2>
            <h3>${pokemon.name.toUpperCase()}</h3>
            <img src="${pokemonData.sprites.front_default}" alt="${pokemon.name}">
            <div class="types">${pokemonData.types.map(type => `<span class="${type.type.name}-type-color">${type.type.name}</span>`).join('')}</div>
        </div>
    `;
}
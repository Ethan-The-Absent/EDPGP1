let nameH1;
let seenOnHeader;
let filmsUl;
let charUl;
const baseUrl = `http://localhost:9001/api`;

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  nameH1 = document.querySelector('h1#name');
  seenOnHeader = document.getElementById('seen-on');
  filmsUl = document.getElementById("films-list");
  charUl = document.getElementById("character-list")
  const sp = new URLSearchParams(window.location.search);
  const id = sp.get('id');
  getPlanet(id)
});

async function getPlanet(id) {
  let planet;
  try {
    planet = await fetchPlanet(id);
    planet.characters = await fetchCharacters(id)
    planet.films = await fetchFilms(planet)
  }
  catch (ex) {
    console.error(`Error reading planet ${id} data.`, ex.message);
  }
  renderPlanet(planet);

}

async function fetchPlanet(id) {
    let planetUrl = `${baseUrl}/planets/${id}`
    return await fetch(planetUrl)
    .then(res => res.json())
}

async function fetchCharacters(id) {
  let characterUrl = `${baseUrl}/planets/${id}/characters`;
  return await fetch(characterUrl)
    .then(res => res.json())
}


async function fetchFilms(planet) {
  const url = `${baseUrl}/planets/${planet?.id}/films`;
  const films = await fetch(url)
    .then(res => res.json())
  return films;
}

const renderPlanet = planet => {
  document.title = `SWAPI - ${planet?.name}`; 
  nameH1.textContent = planet?.name;
  seenOnHeader.innerHTML = `Characters seen on ${planet?.name}`;
  const charLis = planet?.characters?.map(character => `<li><a href="/character.html?id=${character.id}">${character.name}</li>`)
  charUl.innerHTML = charLis.join("");
  const filmsLis = planet?.films?.map(film => `<li><a href="/film.html?id=${film.id}">${film.title}</li>`)
  filmsUl.innerHTML = filmsLis.join("");
}

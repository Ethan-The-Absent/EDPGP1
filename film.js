let titleH1;
let releasedYearSpan;
let directorSpan;
let episodeSpan;
let charactersUl;
let planetsUl;
const baseUrl = `http://localhost:9001/api`;

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  titleH1 = document.querySelector('h1#title');
  releasedYearSpan = document.querySelector('span#released_year');
  directorSpan = document.querySelector('span#director');
  episodeSpan = document.querySelector('span#episode');
  charactersUl = document.querySelector('#characters>ul');
  planetsUl = document.querySelector('#planets>ul');

  const sp = new URLSearchParams(window.location.search)
  const filmID = sp.get('id')
  getFilm(filmID)
});

// Get all the needed film info and render it to the page
async function getFilm(filmID) {
    let film;
    try {
        film = await fetchFilm(filmID);
        film.characters = await fetchCharacters(filmID);
        film.planets = await fetchPlanets(filmID);
    }
    catch (ex) {
        console.error(`Error reading film ${filmID} data.`, ex.message);
    }
    renderFilm(film);
}

async function fetchFilm(filmID) {
    const filmURL = `${baseUrl}/films/${filmID}`;
    return await fetch(filmURL)
      .then(res => res.json());
}

async function fetchCharacters(filmID) {
    const charURL = `${baseUrl}/films/${filmID}/characters`;
    const characters = await fetch(charURL)
      .then(res => res.json());
    return characters;
}

async function fetchPlanets(filmID) {
    const planetsURL = `${baseUrl}/films/${filmID}/planets`;
    const planets = await fetch(planetsURL)
      .then(res => res.json())
    return planets;
  }

const renderFilm = film => {
    document.title = `SWAPI - ${film?.title}`;
    titleH1.textContent = film?.title;
    releasedYearSpan.textContent = film?.release_date;
    directorSpan.textContent = film?.director;
    episodeSpan.textContent = film?.episode_id;
    const charactersList = film?.characters?.map(character => `<li><a href="/character.html?id=${character.id}">${character.name}</li>`);
    charactersUl.innerHTML = charactersList.join("");
    const planetList = film?.planets?.map(planet => `<li><a href="/planets.html?id=${planet.id}">${planet.name}</li>`);
    planetsUl.innerHTML = planetList.join("");
}
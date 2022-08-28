// import info from './hbs/info-markup.hbs';
// import list from './hbs/list-markup.hbs';
import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputSearch = document.querySelector('#search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');

inputSearch.addEventListener('input', debounce(onInputFetch, DEBOUNCE_DELAY));

function onInputFetch(evt) {
  const inputValue = evt.target.value.trim();

  if (inputValue !== '') {
    fetchCountries(inputValue).then(renderMarkup).catch(fetchError);
  }
  return;
}

function renderMarkup(data) {
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.', {
      timeout: 1500,
    });
    return;
  }

  if (data.length === 1) {
    createInfoMarkup(data);
    return;
  }

  if (data.length > 1 && data.length <= 10) {
    createListMarkup(data);
  }
}

function createInfoMarkup(data) {
  removeMarkup();
  const infoMarkup = data
    .map(({ name, capital, population, flags, languages }) => {
      return `<h2><img style="width: 50px" src="${flags.png}" alt="${
        name.official
      }"> ${name.official}</h2>
    <p><b>Capital: </b>${capital}</p>
    <p><b>Population: </b>${population}</p>
    <p><b>Languages: </b>${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
  infoCountry.insertAdjacentHTML('beforeend', infoMarkup);
}

function createListMarkup(data) {
  removeMarkup();
  const listMarkup = data
    .map(({ name, flags }) => {
      return `<li style="list-style: none">
        <p><img style="width: 40px" src="${flags.svg}" alt="${name.official}"/> 
        ${name.official}</p>
      </li>`;
    })
    .join('');
  listCountry.insertAdjacentHTML('beforeend', listMarkup);
}

function fetchError(error) {
  if (error.message === '404') {
    return setTimeout(notiflixFailureDelay, 400);
  }
  return Notify.failure(`Oops, server error:"${error}"`);
}

function notiflixFailureDelay() {
  return Notify.failure('Oops, there is no country with that name');
}

function removeMarkup() {
  listCountry.innerHTML = '';
  infoCountry.innerHTML = '';
}

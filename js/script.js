const global = {
    currentPage: window.location.pathname,
    search: {
      term:'',
      type: '',
      page: 1,
      totalPages: 1
    },
    api: {apiKey: '583b933176ae70467201e064968cf907',
        apiURL: 'https://api.themoviedb.org/3/'
  }
}

//Displays popular movies
async function displayPopularMovies(){
    const { results } = await fetchAPIData('movie/popular');
    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = 
        `<a href="movie-details.html?id=${movie.id}">
          ${
            movie.poster_path ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />`: `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${movie.title}"
        />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        `
    document.querySelector('#popular-movies').appendChild(div);
    })
}

//Displays popular tv shows
async function displayPopularShows(){
    const { results } = await fetchAPIData('tv/popular');
    results.forEach(tv => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = 
        `<a href="tv-details.html?id=${tv.id}">
          ${
            tv.poster_path ? `<img
            src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
            class="card-img-top"
            alt="${tv.name}"
          />`: `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${tv.name}"
        />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${tv.name}</h5>
          <p class="card-text">
            <small class="text-muted">Aired: ${tv.first_air_date}</small>
          </p>
        `
    document.querySelector('#popular-shows').appendChild(div);
    })
}

//Display spinner when making call to API
function showSpinner(){
    document.querySelector('.spinner').classList.add('show');
}
function hideSpinner(){
    document.querySelector('.spinner').classList.remove('show');
}


//Display movie details
async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1];
    const movie = await fetchAPIData(`movie/${movieId}`);
    console.log(movie);
    //Overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path)

    const div = document.createElement('div');
    div.innerHTML = `<div class="details-top">
    <div>
      ${
        movie.poster_path ? `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt= "${movie.title}"
      />` : `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${movie.title}"
      />`}
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
        ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre)=>`<span>${genre.name}</span>`).join(', ')}
      </ul>
      <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> ${movie.budget ? `$${addCommasToNumber(movie.budget)}`:`N/A` }</li>
      <li><span class="text-secondary">Revenue:</span> ${movie.revenue ? `$${addCommasToNumber(movie.revenue)}` : `N/A`}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
     ${movie.production_companies.map((company)=>`<span>${company.name} </span>`).join(', ')}
    </div>
  </div>`

  document.querySelector('#movie-details').appendChild(div);
}

//Display show details
async function displayShowDetails() {
    const showId = window.location.search.split('=')[1];
    const show = await fetchAPIData(`tv/${showId}`);
    // console.log(show);
    //OverlayBackground Image
    displayBackgroundImage('tv', show.backdrop_path );

    const div = document.createElement('div');
    div.innerHTML = `<div class="details-top">
    <div>
      ${show.poster_path ? `<img src = "https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
      />`: `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${show.name}"
    />`}
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">First Air Date: ${show.first_air_date}</p>
      <p>${show.overview ? `${show.overview}` : `No information available on this TV show.`}</p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${show.genres.map((genre)=>`<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${show.last_air_date}
      </li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies.map((company)=>`<span>${company.name} </span>`).join(', ')}</div>
  </div>`;
  if(!show.overview){
    console.log(div.querySelector('.details-top').style.justifyContent = 'center');
  }
  document.querySelector('#show-details').appendChild(div);
}


//Display backdrop on Details Pages
function displayBackgroundImage(type, backgroundPath){
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';
    if(type === 'movie'){
        document.querySelector('#movie-details').appendChild(overlayDiv);

    }
    else{
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

// Display slider movies
async function displaySlider(){
  const { results } = await fetchAPIData('movie/now_playing');
  results.forEach((movie)=> {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt = "${movie.title}"/>
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
    </h4>`

    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  })
}

//Display slider TV Shows

async function displaySliderTV(){
  const { results } = await fetchAPIData('tv/airing_today');
  results.forEach((show)=>{
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `<a href="tv-details.html?id=${show.id}">
    <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt = "${show.name}"/>
  </a>
  <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${show.vote_average.toFixed(1)} / 10
  </h4>`

  document.querySelector('.swiper-wrapper').appendChild(div);

  initSwiper();
  })

}
//Search Movies/Shows
async function search(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if(global.search.term !== '' && global.search.term !== null){
    //@todo - make request and display results
    const {results, total_pages, pages} = await searchAPIData();
    if ( results.length === 0){
      showAlert('No results found')
    }

    displaySearchResults(results);

    document.querySelector('#search-term').value = '';
  }
  else{
    showAlert('Please enter a search term', 'error');
  }
}

function displaySearchResults(results){
  results.forEach(result => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = 
    `<a href="${global.search.type}-details.html?id=${result.id}">
      ${
        result.poster_path ? `<img
        src="https://image.tmdb.org/t/p/w500${result.poster_path}"
        class="card-img-top"
        alt="${global.search.type === 'movie' ? result.title : result.name}"
      />`: `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${global.search.type === 'movie' ? result.title : result.name}"
    />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
      </p>
    `
document.querySelector('#search-results').appendChild(div);
})
}

//Display slider movies
function initSwiper(){
  const swiper = new Swiper('.swiper',{
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    breakpoints: {
      500: {
        slidesPerView: 2
      },
      700: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      }
    }
  })
}

//Fetch data from TMDB API
async function fetchAPIData(endpoint){
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiURL;
    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    hideSpinner();
    return data;
}

//Make Request to Search
async function searchAPIData(){
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;
  showSpinner();
  const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`);
  const data = await response.json();
  hideSpinner();
  return data;
}

//Highlight Active Link
function highlightActiveLink(){
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link)=>{
        if(link.getAttribute('href')=== global.currentPage){
            link.classList.add('active');
        }
    })
}

// Show Alert
function showAlert(message, className="error"){
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(()=> alertEl.remove(), 3000)
}

function addCommasToNumber(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')
}

//Init app
function init(){
    switch(global.currentPage){
        case "/":
        case "/index.html":
            displayPopularMovies();
            displaySlider();

            break;
        case '/shows.html':
            displayPopularShows();
            displaySliderTV()
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search.html':
            search();
            break;
    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded',init);
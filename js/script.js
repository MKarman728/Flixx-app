const global = {
    currentPage: window.location.pathname
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

//Fetch data from TMDB API
async function fetchAPIData(endpoint){
    const API_KEY = '583b933176ae70467201e064968cf907';
    const API_URL = 'https://api.themoviedb.org/3/';
    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
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

//Init app
function init(){
    switch(global.currentPage){
        case "/":
        case "/index.html":
            displayPopularMovies();

            break;
        case '/shows.html':
            displayPopularShows();
            break;
        case '/movie-details.html':
            console.log('Movie Details');
            break;
        case '/tv-details.html':
            console.log('TV Details');
            break;
        case '/search.html':
            console.log('Search');
            break;
    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded',init);
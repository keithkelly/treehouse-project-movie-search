!function() {
  const mainContent = document.querySelector('.main-content');

  // Get a list of movies based on a search parameter
  function getMovies() {
    $.ajax({
      url: 'http://www.omdbapi.com',

      data: {
        s: document.getElementById('search').value,
        r: 'json',
        type: 'movie',
        y: document.getElementById('year').value
      },

      success: function(results) {
        results.Error ? searchError() : listMovies(results);
      }
    });
  }

  // Get details of a specific movie based on IMDB id
  function getMovieDetails(movieID) {
    $.ajax({
      url: 'http://www.omdbapi.com',

      data: {
        i: movieID,
        plot: 'full',
        r: 'json'
      },

      success: function(results) {
        displayMovieDetailPage(results);
      }
    });
  }

  // List all of the movie results
  function listMovies(results) {
    mainContent.classList.remove('movie-detail');
    mainContent.innerHTML = `
      <ul id="movies" class="movie-list"></ul>
    `;
    for(let i = 0; i < results.Search.length; i++) {
      displayMovie(results.Search[i]);
    }
  }

  // If there was an error during the search display message with movie title and year (if year exists)
  function searchError() {
    const query = document.getElementById('search').value;
    const year = document.getElementById('year').value;
    let yearMessage = '';
    if(year) { yearMessage = ' released in ' + year; }

    let html = `
      <ul id="movies" class="movie-list">
        <li class="no-movies">
          <i class="material-icons icon-help">help_outline</i>No movies found that match: ${query}${yearMessage}.
        </li>
      </ul>
    `;
    mainContent.innerHTML = html;
  }

  // Display overview of movie in movie list
  function displayMovie(movie) {
    const poster = displayMoviePoster(movie);
    document.getElementById('movies').insertAdjacentHTML('beforeend', `
      <li>
        <a id="${movie.imdbID}">
          <div class="poster-wrap">${poster}</div>
          <span class="movie-title">${movie.Title}</span>
          <span class="movie-year">${movie.Year}</span>
        </a>
      </li>
    `); 

    // Show the movie details when user clicks on the overview in the list
    document.getElementById(movie.imdbID).addEventListener('click', function(event) {
      event.preventDefault();
      getMovieDetails(movie.imdbID);
    });
  }

  // Display detailed information for specific movie
  function displayMovieDetailPage(movie) {
    const poster = displayMoviePoster(movie);
    const html = `
      <header>
        <div>
          <a id="back">
            <i class="material-icons">keyboard_arrow_left</i> 
            <span>Search Results</span>
          </a>
        </div>
        <div class="poster-wrap">${poster}</div>
        <h1>${movie.Title} (${movie.Year})</h1>
        <p>IMDB Rating: ${movie.imdbRating}</p>
      </header>
      
      <div class="movie-description">
        <h4>Plot Synopsis:</h4>
        <p>${movie.Plot}</p>
        <a href="http://www.imdb.com/title/${movie.imdbID}" target="_blank">View on IMDB</a>
      </div>
    `;
    mainContent.classList.add('movie-detail');
    mainContent.innerHTML = html;

    // Go back to previous results
    // This will look at the search input again and make a new ajax request
    // If the user clears the input the no results error message will display
    document.getElementById('back').addEventListener('click', function(event) {
      event.preventDefault();
      getMovies();
    });
  }

  // Display the poster or placeholder if no poster exists
  function displayMoviePoster(movie) {
    let poster = `<img class="movie-poster" src="${movie.Poster}" alt="${movie.Title}">`;
    if(movie.Poster === 'N/A') { poster = `<i class="material-icons poster-placeholder">crop_original</i>`; }
    return poster;
  }

  // Set click event on search button
  document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault();
    getMovies();
  });
}();
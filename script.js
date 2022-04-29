const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");
const resultGrid2 = document.getElementById("result-grid2");
const favbtn = document.getElementById("fav");

// Api call from OMDB website and if data true then send to displaymoviesList function
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=b013fe1c`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data.Search);
  if (data.Response == "True") displayMovieList(data.Search);
}

//onclick function findMovies which showcase all list of array from searchterm
function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

document.getElementById("movies").className = "";
document.getElementsByClassName("tablinks")[0].className = "active";

function openTab(event, tab) {
  if (tab === "favourites") {
    document.getElementById("movies").className = "tabcontent";
    document.getElementById("favourites").className = "";
    document.getElementById("movieBtn").className = "";
    document.getElementById("favBtn").className = "active";
  }

  if (tab === "movies") {
    document.getElementById("movies").className = "";
    document.getElementById("favourites").className = "tabcontent";
    document.getElementById("movieBtn").className = "active";
    document.getElementById("favBtn").className = "";
  }
}

//displaymoviesList fucntion showcase
function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "image_not_found.png";

    movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
  favbtn.className = "favBtnActive";
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      console.log(movie.dataset.id);
      fetchMov(movie.dataset.id);
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=b013fe1c`
      );
      const movieDetails = await result.json();
      // console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${
          details.Poster != "N/A" ? details.Poster : "image_not_found.png"
        }" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${
          details.Awards
        }</p>
    </div>
    `;
}

let array = [];

async function fetchMov(id) {
  const result = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=b013fe1c`);
  const movieDetails = await result.json();
  array.push(movieDetails);
}

const favDiv = document.getElementById("favourite");

function addFavList() {
  console.log(array);
  favDiv.innerHTML = array
    .map((movie) => displayFavMovieDetails(movie))
    .join("");
  // array.forEach(async(id) => {
  //     console.log(id)

  //     displayFavMovieDetails(movieDetails);
  // })
  // console.log(movieDetails)
  // displayFavMovieDetails(movieDetails);
}

function displayFavMovieDetails(details) {
  return `
        <div class = "result-container">
            <div class = "result-grid" id = "result-grid">
                <div class = "movie-poster">
                    <img src = "${details.Poster != "N/A" ? details.Poster : "image_not_found.png"}" alt = "movie poster">
                </div>
                <div class = "movie-info">
                    <h3 class = "movie-title">${details.Title}</h3>
                    <ul class = "movie-misc-info">
                        <li class = "year">Year: ${details.Year}</li>
                        <li class = "rated">Ratings: ${details.Rated}</li>
                        <li class = "released">Released: ${details.Released}</li>
                    </ul>
                    <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
                    <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
                    <p class = "actors"><b>Actors: </b>${details.Actors}</p>
                    <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
                    <p class = "language"><b>Language:</b> ${details.Language}</p>
                    <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
                </div>
            </div>
            <div class="unfavourite"><button id="unfav" class="unfavouriteBtn" onclick="addUnFavMovie('${details.imdbID}')" >UnFavourite</button></div>
        </div>
    `;
}
// bindingFunction();

// function bindingFunction(){
//     document.getElementById('unfav').onclick = function() {
//         console.log(details.imdbID)
//     }
// }
function addUnFavMovie(id){
    console.log(array)
    console.log(id)
    // console.log(details.imdbID)
    const movieId = array.indexOf(id); // 2
    const removedArray = array.splice(movieId,  1);
    console.log(array)
    addFavList()
}

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
});

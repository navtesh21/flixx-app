const global = {
    currentPage: window.location.pathname,
    search : {
      type: window.location.search,
      page:1,
      totalPages: 1,
      totalResults:1
    },
    guestSessionId : null,
    api_key: '2f9e8a399997776527a6fb991b23cd51'
}


// Function to create a new guest session
async function createGuestSession() {
  const response = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${global.api_key}`);
  const data = await response.json();
  global.guestSessionId = data.guest_session_id;
}

const highLightActiveLink = () => {
    const navLink = document.querySelectorAll(".nav-link");

    navLink.forEach((link) => {
        const correction = link.getAttribute("href").split(".")
        if(`/flixx-app${correction[1]}.html` === global.currentPage){
            link.classList.add("active");
        }
        

    }) 
  
}

function showSpinner() {
    document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
    document.querySelector(".spinner").classList.remove("show");
}

//display slider with slider js
async function displaySlider() {
  const { results } = await fetchApiData('movie/now_playing');
 
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
      </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  });
}

// initializing the swipper is necessary
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30 ,
    freeMode: false,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

//display popular movies only first 20
const displayPopularMovies = async() => {
    const endpoint = 'movie/popular'
    const  {results }= await fetchApiData(endpoint)
   
    
    results.forEach((movie) => {
        const div = document.createElement("div");
        const popular = document.querySelector("#popular-movies")
        div.classList.add("card");
        
        div.innerHTML  =  `<a href = " movie-details.html?id=${movie.id}">
        ${movie.poster_path?
           ` <img
            src = https://image.tmdb.org/t/p/w500${movie.poster_path}
            class="card-img-top "
            alt=${movie.original_title}
          >`:
          `<img
          src = "./images/no-image.jpg"
          class="card-img-top"
          alt=${movie.original_title}
          >
        </a>`
        }
          
        <div class = "card-body"> 
          <h5 class = "card-title">${movie.original_title}</h5>
          <p class="card-text">
            <small class = "text-muted">Release: ${movie.release_date}</small>
          </p>
        <div>  `
      
        popular.appendChild(div)
    })
    
}

//display top 20 popular tv shows
const displayPopularShows = async() => {
    const endpoint = 'tv/popular'
    const  {results }= await fetchApiData(endpoint)
   console.log(results)
    
    results.forEach((show) => {
        const div = document.createElement("div");
        const popular = document.querySelector("#popular-shows")
        div.classList.add("card");
        
        div.innerHTML  =  `<a href = " tv-details.html?id=${show.id}">
        ${show.poster_path?
           ` <img
            src = https://image.tmdb.org/t/p/w500${show.poster_path}
            class="card-img-top"
            alt=${show.original_name}
          >`:
          `<img
          src = "./images/no-image.jpg"
          class="card-img-top"
          alt=${show.original_name}
          >
        </a>`
        }
          
        <div class = "card-body"> 
          <h5 class = "card-title">${show.original_name}</h5>
          <p class="card-text">
            <small class = "text-muted">Air Date: ${show.first_air_date}</small>
          </p>
        <div>  `
      
        popular.appendChild(div)
    })
}

//adding movie details
async function getMovieDetails() {
    const movieId = window.location.search.split("=")[1]
    const movie = await fetchApiData(`movie/${movieId}`)
    const div = document.createElement("div")
    const details = document.getElementById("movie-details")
    addBackdropImage("movies",movie.backdrop_path);
    div.innerHTML= `  <div class="details-top">
    <div>
       ${movie.poster_path?
           ` <img
            src = https://image.tmdb.org/t/p/w500${movie.poster_path}
            class="card-img-top"
            alt=${movie.original_title}
          >`:
          `<img
          src = "./images/no-image.jpg"
          class="card-img-top"
          alt=${movie.original_title}
          >
        </a>`
        }
    </div>
    <div>
      <h2>${movie.original_title}</h2>
      <p class = "rate">
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)}/ 10 <i class="fas fa-plus text-primary add-rating" title= "click to add rating"></i>
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
       ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${ toDisplayNames(movie.genres).map((gen) => `<li>${gen}</li>`).join("")}
      </ul>
      <a href=${movie.homepage} target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group"> ${ toDisplayNames(movie.production_companies).map((gen) => `<span>${gen}</span>`).join()}</div>
  </div> `
  details.appendChild(div)
  function addRating() {
    const existingForm = document.querySelector(".rating");

  // Check if the form already exists
  if (!existingForm) {
    const rate = document.querySelector(".rate");
    const form = document.createElement("div");
    form.classList.add("rating");
    form.innerHTML = `
      <form class = "rating-form">
        <input  placeholder="Add Rating" class="rating-input">
        <button class="rating-btn">submit</button>
      </form>
    `;
    rate.insertAdjacentElement("afterend", form);
    void form.offsetWidth;
    form.style.opacity = 1
  }
  document.querySelector(".rating-form").addEventListener("submit",addRatingToData)
  }
  document.querySelector(".add-rating").addEventListener("click",addRating)
  
}

async function addRatingToData(e){
  e.preventDefault()
  const rating = document.querySelector(".rating-input").value

  const typeId = window.location.search.split("=")[1]
  if(!global.guestSessionId){
    await createGuestSession()
  }
  const type = global.currentPage.split("/")[2].split("-")[0]
  await fetchRate(rating,type,typeId)

  document.querySelector(".rating-input").value = ""
  document.querySelector(".rating").remove()
}

async function fetchRate(rating,type,typeId) {
  const result = await fetch(`https://api.themoviedb.org/3/${type}/${typeId}/rating?api_key=${global.api_key}&guest_session_id=${global.guestSessionId}`,{
    method:"POST",
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({value: rating})
  })
  
  const {status_message} = await result.json()
  alert(status_message);
}


//add tv show details
async function getShowDetails() {
  const showId = window.location.search.split("=")[1]
  const show = await fetchApiData(`tv/${showId}`)
  const div = document.createElement("div")
  const details = document.getElementById("show-details")

  addBackdropImage("show",show.backdrop_path)
  div.innerHTML= `  <div class="details-top">
  <div>
     ${show.poster_path?
         ` <img
          src = https://image.tmdb.org/t/p/w500${show.poster_path}
          class="card-img-top"
          alt=${show.original_name}
        >`:
        `<img
        src = "./images/no-image.jpg"
        class="card-img-top"
        alt=${show.original_name}
        >
      </a>`
      }
  </div>
  <div>
    <h2>${show.original_name}</h2>
    <p class = "rate">
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)}/ 10 <i class="fas fa-plus text-primary add-rating" title= "click to add rating"></i>
    </p>
    <p class="text-muted">First air date: ${show.first_air_date}</p>
    <p>
     ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${ toDisplayNames(show.genres).map((gen) => `<li>${gen}</li>`).join("")}
    </ul>
    <a href=${show.homepage} target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Total Number Of Seasons:</span> ${show.number_of_seasons}</li>
    <li><span class="text-secondary">Total Number Of Episodes:</span> ${show.number_of_episodes}</li>
    <li><span class="text-secondary">Per Episode Runtime:</span> ${show.episode_run_time} minutes</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group"> ${ toDisplayNames(show.production_companies).map((gen) => `<span>${gen}</span>`).join()}</div>
</div> `
details.appendChild(div)
function addRating() {
  const existingForm = document.querySelector(".rating");

// Check if the form already exists
if (!existingForm) {
  const rate = document.querySelector(".rate");
  const form = document.createElement("div");
  form.classList.add("rating");
  form.innerHTML = `
    <form class = "rating-form">
      <input  placeholder="Add Rating" class="rating-input">
      <button class="rating-btn">submit</button>
    </form>
  `;
  rate.insertAdjacentElement("afterend", form);
  void form.offsetWidth;
  form.style.opacity = 1;
}
document.querySelector(".rating-form").addEventListener("submit",addRatingToData)
}
document.querySelector(".add-rating").addEventListener("click",addRating)
}

//params
function params() {
  const queryString = global.search.type
  const param = new URLSearchParams(queryString)
  return param;
}



//search functionality
async function search() {
   
   const param = params()
   const type = param.get("type")
   const searchItem = param.get("search-term")
   
   
   if(searchItem !== "" && searchItem !== null ) {

    const results = await searchApiData()
    
    
    const heading = document.querySelector("#number-results") 
    heading.appendChild(document.createTextNode(`${results.total_results} results available for "${searchItem}"`))
    addDataToSearch();
    document.querySelector("#search-term").value=""

   }else{

    const div = document.createElement("div")
    div.classList.add("alert", "error")
    div.appendChild(document.createTextNode("Please write something in the search box you nerd!! "))
    const alert = document.getElementById("alert")
    alert.appendChild(div)

    setTimeout(() => {
      div.remove()
    },5000)
   }
}

//adding data to search html
async function addDataToSearch() {

  document.querySelector("#search-results").innerHTML=""
  document.querySelector("#pagination").innerHTML=""
   const param = params()
   const type = param.get("type")

   const  { results } = await searchApiData()
   

   
  results.forEach((data) => {
    const div = document.createElement("div");
    div.classList.add("card");
    
    div.innerHTML  =  `<a href = " ${type}-details.html?id=${data.id}">
    ${data.poster_path?
       ` <img
        src = https://image.tmdb.org/t/p/w500${data.poster_path}
        class="card-img-top "
        alt=${type === `movie` ? data.original_title: data.original_name}
      >`:
      `<img
      src = "./images/no-image.jpg"
      class="card-img-top"
      alt=${type === `movie` ? data.original_title: data.original_name}
      >
    </a>`
    }
      
    <div class = "card-body"> 
      <h5 class = "card-title">${type === `movie` ? data.original_title: data.original_name}</h5>
      <p class="card-text">
        <small class = "text-muted">Release: ${type === `movie` ? data.release_date: data.first_air_date}</small>
      </p>
    <div>  `
  
    document.querySelector("#search-results").appendChild(div);

})

   addPagination();
};

//adding pagination to search html
async function addPagination() {
   const {page ,total_pages} = await searchApiData()

   global.search.page = page
   global.search.totalPages = total_pages
   
   const div = document.createElement("div")
   div.classList.add("pagination")
   div.innerHTML =`<button class="btn btn-primary" id="prev">Prev</button>
   <button class="btn btn-primary" id="next">Next</button>
   <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`
   document.getElementById("pagination").appendChild(div)
   document.getElementById("next").addEventListener("click",forward)
   document.getElementById("prev").addEventListener("click",backward)
   if(global.search.page === 1){
    document.getElementById("prev").disabled = true
   }

   if(global.search.page === global.search.totalPages){
    document.getElementById("next").disabled = true
   }

  }
  
  //next button in pagination
  function forward() {
    global.search.page=global.search.page + 1
    addDataToSearch()
  }
  
  //prev button in pagination
  function backward() {
    global.search.page=global.search.page - 1
    addDataToSearch()
  }


//fetch data from api
async function fetchApiData(endpoint) {

    const api_key = '2f9e8a399997776527a6fb991b23cd51'
    const api_url =`https://api.themoviedb.org/3/`
    showSpinner()
     
    const response = await fetch(`${api_url}${endpoint}?api_key=${api_key}&language=en-US`)
    const data = await response.json()

    await delay()
    return data;
}

// searching functionality & getting data from api
async function searchApiData() {

  const param = params()
  const type = param.get("type")
  const searchItem = param.get("search-term")

  const api_key = '2f9e8a399997776527a6fb991b23cd51'
  const api_url =`https://api.themoviedb.org/3/`
  showSpinner()
   
  const response = await fetch(`${api_url}search/${type}?api_key=${api_key}&language=en-US&query=${searchItem}&page=${global.search.page}`)
  const data = await response.json()

  await delay()
  return data;
}

// adding delay for spinner
const delay = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            hideSpinner();
            resolve();

        },1000)
    })
}

function toDisplayNames(arr) {
  const names = arr.map((names) => {
  return names.name})
  

  return names;
}

function addCommasToNumber(number) {
   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 }

//adding background image
function addBackdropImage(type,backdropImage) {
   div = document.createElement("div")
   div.style.backgroundImage = `url( https://image.tmdb.org/t/p/original/${backdropImage})`
   div.classList.add("overlay")

   if(type === "movies"){
     document.querySelector("#movie-details").appendChild(div)
   }
   else{
     document.querySelector("#show-details").appendChild(div)
   }
}  

// Init app and routing
function init() {
    switch(global.currentPage){
        case "/flixx-app/index.html":
            displayPopularMovies();
            displaySlider();
            break;
        case "/flixx-app/":
            displayPopularMovies();
            displaySlider();
            break;    
        case "/flixx-app/movie-details.html"  :
            getMovieDetails();
            break; 
        case "/flixx-app/shows.html":
            displayPopularShows()
            break;
        case "/flixx-app/tv-details.html":
            getShowDetails();
            break;  
        case "/flixx-app/search.html":
           search() ;
            break;    
        
    }
    highLightActiveLink();

}


document.addEventListener("DOMContentLoaded",init)

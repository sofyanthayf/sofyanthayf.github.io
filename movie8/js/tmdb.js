const key = "323ee6e4b1621c63a0a839a8e48ba899";
const endpoint_url = 'https://api.themoviedb.org/3/';


function getListMovie() {
    fetch(endpoint_url + 'movie/now_playing?api_key=' + key + '&language=en-US&page=1' )
    .then(status)
    .then(json)
    .then( function(data){
        let movieHTML = "";

        data.results.forEach( function(movie) {
            movieHTML += `
                <div class="col m3 s6">
                    <div class="card">
                        <a href="./movie.html?id=${movie.id}">
                            <div class="card-image waves-effect waves-block waves-light">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
                            </div>
                        </a>
                        <div class="card-content text-center">
                            <strong>${movie.title}</strong>
                        </div>
                    </div>
                </div>            
            `;
            
            
        });

        document.getElementById("movie_list").innerHTML = movieHTML;
    })
    .catch(error);
}

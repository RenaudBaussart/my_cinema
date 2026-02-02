import {CustomApiResponse} from "./CustomApiResponse.js";
export class Movie{
    id;
    title ;
    description ;
    duration ;
    release_year ;
    genre ;
    director ;
    is_deleted;
    creation_at;
    modified_at;

    constructor(id,title,description,duration,release_year,genre,director,is_deleted,creation_at,modified_at){
        this.id = id;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.release_year = release_year;
        this.genre = genre;
        this.director = director;
        this.is_deleted = is_deleted;
        this.creation_at = creation_at;
        this.modified_at = modified_at;
    }

    static async getMoviesList(){
        const response = await fetch('http://localhost:8000?action=list_movies', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        const data = await CustomApiResponse.convertJson( await response.json());
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de la récupération de la liste des films : " + data.getMessage());
        }
        else{
            return data.getMessage().map(movieData => new Movie(
                movieData.id,
                movieData.title,
                movieData.description,
                movieData.duration,
                movieData.release_year,
                movieData.genre,
                movieData.director,
                movieData.is_deleted,
                movieData.creation_at,
                movieData.modified_at
            ));
        }
        
    }
    static generateMovieView(moviesArray){
        const listViewContainer = document.getElementById("main_li");
        listViewContainer.innerHTML = "";
        moviesArray.forEach(movie => {
            const movieElement = document.createElement("div");
            movieElement.className = "movie_list_item";
            movieElement.innerHTML = `
                <h2>${movie.title}</h2>
                <p>${movie.description}</p>
                <p>Durée: ${movie.duration} minutes</p>
                <p>Année de sortie: ${movie.release_year}</p>
                <p>Genre: ${movie.genre}</p>
                <p>Réalisateur: ${movie.director}</p>
                <div class="movie-actions">
                    <button class="edit-movie" data-id="${movie.id}">Éditer</button>
                    <button class="delete-movie" data-id="${movie.id}">Supprimer</button>
                </div>
            `;
            listViewContainer.appendChild(movieElement);
        });
    }
    static async init(){
        const movies = await Movie.getMoviesList();
        Movie.generateMovieView(movies);
    }
    static async deleteMovie(movieId){
        const response = await fetch(`http://localhost:8000?action=delete_movie&id=${movieId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await CustomApiResponse.convertJson( await response.json());
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de la suppression du film : " + data.getMessage());
        }
        else{
            Movie.init();
        }
    }
}
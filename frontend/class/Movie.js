import {CustomApiResponse} from "./CustomApiResponse.js";
import {ModalArchitect} from "../component/Modalarchitect.js";
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
                    <button class="edit-movie" id="edit_${movie.id}">Éditer</button>
                    <button class="delete-movie" id="del_${movie.id}">Supprimer</button>
                </div>
            `;
            listViewContainer.appendChild(movieElement);
            let editButton = document.getElementById(`edit_${movie.id}`);
            let delButton = document.getElementById(`del_${movie.id}`);

            editButton.addEventListener("click", () => {
                console.log("Edit movie with ID:", movie.id);
                const modal = new ModalArchitect();
                modal.modifyMovie(movie);
            });

            delButton.addEventListener("click", async () => {
                try {
                    await Movie.deleteMovie(movie.id);
                    alert("Film supprimé avec succès.");
                } catch (error) {
                    alert("Erreur lors de la suppression du film :" + error.message);
                }
            });
        });

        const listContainerElement = document.getElementById("list_container");
        let addButtonElement = document.createElement("button");
        addButtonElement.id = "add_movie_button";
        addButtonElement.textContent = "Ajouter un film";
        addButtonElement.addEventListener("click", () => {
            const modal = new ModalArchitect();
            modal.createMovie();
        })
        listContainerElement.appendChild(addButtonElement);
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
        console.log(data);
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de la suppression du film : " + data.getMessage());
        }
        else{
            Movie.init();
        }
    }
static async updateMovie(form){
    const formData = new FormData(form);
    const id = formData.get('id');
    const response = await fetch(`http://localhost:8000?action=update_movie&id=${id}`, {
        method: 'POST',
        body: formData 
    });
        const data = await CustomApiResponse.convertJson( await response.json());
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de la mise à jour du film : " + data.getMessage());
        }
        else{
            Movie.init();
            ModalArchitect.closeModify();
        }
    }

static async addMovie(form){
    const formData = new FormData(form);
    const response = await fetch(`http://localhost:8000?action=add_movie`, {
        method: 'POST',
        body: formData
    });
        const data = await CustomApiResponse.convertJson( await response.json());
        if(data.getType() !== "success"){
            throw new Error("Erreur lors de l'ajout du film : " + data.getMessage());
        }else{
            Movie.init();
            ModalArchitect.closeAdd();
        }
    }
}
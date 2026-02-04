import { Movie } from "../class/movie.js";
export class ModalArchitect {
    static instance = null;
    isOpen = false;
    modalBase;

    constructor() {
        if (ModalArchitect.instance) {
            return ModalArchitect.instance;
        }
        ModalArchitect.instance = this;
        this.modalBase = document.createElement("div");
        this.modalBase.className = "modal_container";
    }

    modifyMovie(movie){
        if(typeof(movie) === "object" && movie instanceof Movie) {
            this.modalBase.innerHTML = "";
            this.modalBase.innerHTML = `
        <form class="movie_form" id="modify_movie_form">
            <input type="hidden" name="id" value="${movie.id}">
            <div class="input_field" id="movie_title_input_field">
                <label>Titre :</label>
                <input type="text" name="title" placeholder="Inception" value="${movie.title}" required>
            </div>

            <div class="input_field" id="movie_description_input_field">
                <label>Description :</label>
                <textarea name="description" placeholder="Un voleur spécialisé dans l extraction..." required>${movie.description}</textarea>
            </div>

            <div class="input_field" id="movie_duration_input_field">
                <label>durée (min) :</label>
                <input type="number" name="duration" placeholder="148" value="${movie.duration}" required>
            </div>

            <div class="input_field" id="movie_release_year_input_field">
                <label>Année de sortie (AAAA) :</label>
                <input type="number" name="release_year" placeholder="2010" value="${movie.release_year}" required>
            </div>

            <div class="input_field" id="movie_genre_input_field">
                <label>Genre :</label>
                <input type="text" name="genre" placeholder="Sci-Fi" value="${movie.genre}" required>
            </div>

            <div class="input_field" id="movie_director_name_input_field">
                <label>Réalisateur :</label>
                <input type="text" name="director" placeholder="ex:Christopher Nolan" value="${movie.director}" required>
            </div>

            <button type="submit">Enregistrer</button>
            <button type="button" id="cancel_modify_movie">Annuler</button>
        </form>`;
            if (!document.body.contains(this.modalBase)) {
                document.body.appendChild(this.modalBase);
            }
            this.modalBase.style.display = "flex";

            document.getElementById("cancel_modify_movie").addEventListener("click", ModalArchitect.closeModify);

            const form = document.getElementById("modify_movie_form");
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await Movie.updateMovie(event.target);
            });
            this.isOpen = true;
        }
    }
    static closeModify(){
        let modal = document.querySelector(".modal_container");
        if(modal){
            modal.style.display = "none";
        }
        this.isOpen = false;
    }

    static createMovie(){
        this.modalBase.innerHTML = "";
        this.modalBase.innerHTML = `
        <form class="movie_form" id="add_movie_form">
            <input type="hidden" name="id"">
            <div class="input_field" id="movie_title_input_field">
                <label>Titre :</label>
                <input type="text" name="title" placeholder="Inception" required>
            </div>

            <div class="input_field" id="movie_description_input_field">
                <label>Description :</label>
                <textarea name="description" placeholder="Un voleur spécialisé dans l extraction..." required></textarea>
            </div>

            <div class="input_field" id="movie_duration_input_field">
                <label>durée (min) :</label>
                <input type="number" name="duration" placeholder="148" required>
            </div>

            <div class="input_field" id="movie_release_year_input_field">
                <label>Année de sortie (AAAA) :</label>
                <input type="number" name="release_year" placeholder="2010" required>
            </div>

            <div class="input_field" id="movie_genre_input_field">
                <label>Genre :</label>
                <input type="text" name="genre" placeholder="Sci-Fi" required>
            </div>

            <div class="input_field" id="movie_director_name_input_field">
                <label>Réalisateur :</label>
                <input type="text" name="director" placeholder="ex:Christopher Nolan" required>
            </div>

            <button type="submit">Enregistrer</button>
            <button type="button" id="cancel_add_movie">Annuler</button>
        </form>`;
        if (!document.body.contains(this.modalBase)) {
                document.body.appendChild(this.modalBase);
            }
            this.modalBase.style.display = "flex";
            document.getElementById("cancel_add_movie").addEventListener("click", ModalArchitect.closeModify);
            const form = document.getElementById("add_movie_form");
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await Movie.addMovie(event.target);
            });
            this.isOpen = true;
    }
    static closeAdd(){
        let modal = document.querySelector(".modal_container");
        if(modal){
            modal.style.display = "none";
        }
        this.isOpen = false;
    }
}
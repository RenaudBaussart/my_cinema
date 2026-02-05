import { Movie } from "../class/movie.js";
import { Room } from "../class/Room.js";
import { Screening } from "../class/Screening.js";
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
        // Add event delegation for cancel buttons
        this.modalBase.addEventListener("click", (e) => {
            if (e.target.classList.contains("modal_cancel_button")) {
                ModalArchitect.closeModify();
            }
        });
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
            <button type="button" class="modal_cancel_button">Annuler</button>
        </form>`;
            if (!document.body.contains(this.modalBase)) {
                document.body.appendChild(this.modalBase);
            }
            this.modalBase.style.display = "flex";

            const form = document.getElementById("modify_movie_form");
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await Movie.updateMovie(event.target);
            });
            this.isOpen = true;
        }
    }
    closeModify(){
        if (!ModalArchitect.instance) {
            new ModalArchitect();
        }
        ModalArchitect.instance.isOpen = false;
        ModalArchitect.instance.modalBase.style.display = "none";
    }

    modifyRoom(room){
        if(typeof(room) === "object" && room instanceof Room) {
            this.modalBase.innerHTML = "";
            this.modalBase.innerHTML = `
        <form class="room_form" id="modify_room_form">
            <input type="hidden" name="id" value="${room.id}">
            <div class="input_field" id="room_name_input_field">
                <label>Nom :</label>
                <input type="text" name="name" placeholder="Salle 1" value="${room.name}" required>
            </div>

            <div class="input_field" id="room_capacity_input_field">
                <label>Capacité :</label>
                <input type="number" name="capacity" placeholder="100" value="${room.capacity}" required>
            </div>

            <div class="input_field" id="room_type_input_field">
                <label>Type :</label>
                <input type="text" name="type" placeholder="Standard" value="${room.type}" required>
            </div>

            <div class="input_field" id="room_active_input_field">
                <label>Active :</label>
                <input type="checkbox" name="active" ${room.active ? 'checked' : ''}>
            </div>

            <button type="submit">Enregistrer</button>
            <button type="button" class="modal_cancel_button">Annuler</button>
        </form>`;
            if (!document.body.contains(this.modalBase)) {
                document.body.appendChild(this.modalBase);
            }
            this.modalBase.style.display = "flex";

            const form = document.getElementById("modify_room_form");
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await Room.updateRoom(event.target);
            });
            this.isOpen = true;
        }
    }

    async modifyScreening(screening){
        if(typeof(screening) === "object" && screening instanceof Screening) {
            const movies = await Movie.getMoviesList();
            const rooms = await Room.getRoomsList();

            let movieOptions = movies.map(movie => `<option value="${movie.id}" ${movie.id == screening.movie_id ? 'selected' : ''}>${movie.title}</option>`).join('');
            let roomOptions = rooms.map(room => `<option value="${room.id}" ${room.id == screening.room_id ? 'selected' : ''}>${room.name}</option>`).join('');

            this.modalBase.innerHTML = "";
            this.modalBase.innerHTML = `
        <form class="screening_form" id="modify_screening_form">
            <input type="hidden" name="id" value="${screening.id}">
            <div class="input_field" id="screening_movie_id_input_field">
                <label>Film :</label>
                <select name="movie_id" required>
                    ${movieOptions}
                </select>
            </div>

            <div class="input_field" id="screening_room_id_input_field">
                <label>Salle :</label>
                <select name="room_id" required>
                    ${roomOptions}
                </select>
            </div>

            <div class="input_field" id="screening_start_time_input_field">
                <label>Heure de début :</label>
                <input type="datetime-local" name="start_time" value="${screening.start_time}" required>
            </div>

            <button type="submit">Enregistrer</button>
            <button type="button" class="modal_cancel_button">Annuler</button>
        </form>`;
            if (!document.body.contains(this.modalBase)) {
                document.body.appendChild(this.modalBase);
            }
            this.modalBase.style.display = "flex";

            const form = document.getElementById("modify_screening_form");
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await Screening.updateScreening(event.target);
            });
            this.isOpen = true;
        }
    }

    createMovie(){
        this.modalBase.innerHTML = "";
        this.modalBase.innerHTML = `
        <form class="movie_form" id="add_movie_form">
            <input type="hidden" name="id">
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
            <button type="button" class="modal_cancel_button">Annuler</button>
        </form>`;
        if (!document.body.contains(this.modalBase)) {
                document.body.appendChild(this.modalBase);
            }
            this.modalBase.style.display = "flex";
            const form = document.getElementById("add_movie_form");
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await Movie.addMovie(event.target);
            });
            this.isOpen = true;
    }
    static closeAdd(){
        if (!ModalArchitect.instance) {
            new ModalArchitect();
        }
        ModalArchitect.instance.isOpen = false;
        ModalArchitect.instance.modalBase.style.display = "none";
    }

    static closeModify(){
        if (!ModalArchitect.instance) {
            new ModalArchitect();
        }
        ModalArchitect.instance.isOpen = false;
        ModalArchitect.instance.modalBase.style.display = "none";
    }

    createRoom(){
        const instance = new ModalArchitect();
        instance.modalBase.innerHTML = "";
        instance.modalBase.innerHTML = `
        <form class="room_form" id="add_room_form">
            <input type="hidden" name="id">
            <div class="input_field" id="room_name_input_field">
                <label>Nom :</label>
                <input type="text" name="name" placeholder="Salle 1" required>
            </div>

            <div class="input_field" id="room_capacity_input_field">
                <label>Capacité :</label>
                <input type="number" name="capacity" placeholder="100" required>
            </div>

            <div class="input_field" id="room_type_input_field">
                <label>Type :</label>
                <input type="text" name="type" placeholder="Standard" required>
            </div>

            <div class="input_field" id="room_active_input_field">
                <label>Active :</label>
                <input type="checkbox" name="active" checked>
            </div>

            <button type="submit">Enregistrer</button>
            <button type="button" class="modal_cancel_button">Annuler</button>
        </form>`;
        if (!document.body.contains(instance.modalBase)) {
                document.body.appendChild(instance.modalBase);
            }
            instance.modalBase.style.display = "flex";
            const form = document.getElementById("add_room_form");
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await Room.addRoom(event.target);
            });
            instance.isOpen = true;
    }

    async createScreening(){
        const movies = await Movie.getMoviesList();
        const rooms = await Room.getRoomsList();

        let movieOptions = movies.map(movie => `<option value="${movie.id}">${movie.title}</option>`).join('');
        let roomOptions = rooms.map(room => `<option value="${room.id}">${room.name}</option>`).join('');

        const instance = new ModalArchitect();
        instance.modalBase.innerHTML = "";
        instance.modalBase.innerHTML = `
        <form class="screening_form" id="add_screening_form">
            <input type="hidden" name="id">
            <div class="input_field" id="screening_movie_id_input_field">
                <label>Film :</label>
                <select name="movie_id" required>
                    ${movieOptions}
                </select>
            </div>

            <div class="input_field" id="screening_room_id_input_field">
                <label>Salle :</label>
                <select name="room_id" required>
                    ${roomOptions}
                </select>
            </div>

            <div class="input_field" id="screening_start_time_input_field">
                <label>Heure de début :</label>
                <input type="datetime-local" name="start_time" required>
            </div>

            <button type="submit">Enregistrer</button>
            <button type="button" class="modal_cancel_button">Annuler</button>
        </form>`;
        if (!document.body.contains(instance.modalBase)) {
                document.body.appendChild(instance.modalBase);
            }
            instance.modalBase.style.display = "flex";
            const form = document.getElementById("add_screening_form");
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await Screening.addScreening(event.target);
            });
            instance.isOpen = true;
    }
}